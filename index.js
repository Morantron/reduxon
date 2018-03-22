import get from 'lodash.get'
import set from 'lodash.set'
import isEmpty from 'lodash.isempty'

const renameObj = (renames = {}, obj) => {
  if (isEmpty(renames)) {
    return obj
  }

  return Object.keys(renames).reduce((acc, from) => {
    const to = renames[from]
    return {
      ...acc,
      ...set({}, to, get(obj, from))
    }
  }, {})
}

export const renameProps = (inputRenames, outputRenames) => mapper => {
  return (state, ownProps) => {
    return renameObj(
      outputRenames,
      mapper(state, renameObj(inputRenames, ownProps))
    )
  }
}

export const combineMappers = (...mappers) => (state, ownProps) =>
  mappers.reduce(
    (props, mapper) => ({
      ...props,
      ...mapper(state, { ...ownProps, ...props })
    }),
    {}
  )

const applyMappers = (mappers, globalState, ownProps) =>
  mappers.map(mapper => mapper(globalState, ownProps))

/**
 * Returns an scoped mapper builder function.
 *
 * Example:
 *
 *  // Given the following state shape
 *  const state = {
 *    pears: [
 *      { id: 1, name: 'pear #1' },
 *      { id: 2, name: 'pear #2' },
 *      { id: 3, name: 'pear #3' }
 *    ],
 *    apples: [
 *      { id: 1, name: 'apple #1' },
 *      { id: 2, name: 'apple #2' },
 *      { id: 3, name: 'apple #3' }
 *    ],
 *    tomatoes: [
 *      { id: 1, name: 'tomato #1' },
 *      { id: 2, name: 'tomato #2' },
 *      { id: 3, name: 'tomato #3' }
 *    ]
 *  }
 *
 *  // You first define a buildMapper function
 *  const buildMapper = scopeBuilder('tomatoes')
 *
 *  // You can now build mappers, notice that "state" refers to the branch of
 *  // the state provided above. This is handy when writing ducks, since ducks
 *  // should mostly care about its own branch of the state.
 *  const firstTomatoMapper = buildMapper((state, props) => state[0])
 *
 *  firstTomatoMapper(state).name // "tomato #1"
 *
 *  // You can compose mappers by prepending other mapper functions
 *  const composedMapperExample = buildMapper(
 *    state => state.pears[0],
 *    state => state.apples[0],
 *    firstTomatoMapper,
 *    (firstPear, firstApple, firstTomato, state, props) => ([
 *      firstPear.name,
 *      firstApple.name,
 *      firstTomato.name
 *    ])
 *  )
 *
 *  composedMapperExample(state) // ["pear #1", "apple #1", "tomato #1"]
 *
 */
export const scopeBuilder = branch => (...args) => {
  const [mapper, ...extraMappers] = args.reverse()

  return (globalState, ownProps) => {
    return mapper(
      ...[
        ...applyMappers(extraMappers.reverse() || [], globalState, ownProps),
        globalState[branch],
        ownProps,
        globalState
      ]
    )
  }
}
