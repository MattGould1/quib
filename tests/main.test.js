/* eslint-env jest */
import constants from '../src/constants'
import quib from '../dist/quib'

describe('quib', () => {
  it('Throws the right error if no schema is provided', () => {
    expect(() => {
      quib()
    }).toThrowError(constants.PROJECT_NAMESPACE + constants.MESSAGES.EMPTY_SCHEMA)
  })

  it('Returns the expected formatted GraphQL query with variables when ENUM arguments are passed', () => {
    const expectedFormat = `{
    getAllArtists (limit:10) {
      artist {name,power}
    }queryArtists (ID_DESC:ID_DESC) {
      id,image,name
    }
  }`

    const quibFormat = quib({
      getAllArtists: {
        artist: {
          name: '',
          power: false
        }
      },

      queryArtists: {
        id: '',
        image: '',
        name: ''
      }
    }, {
      args: {
        getAllArtists: {
          limit: 10
        },

        queryArtists: {
          ID_DESC: 'ID_DESC'
        }
      }
    })

    expect(quibFormat).toBe(expectedFormat)
  })

  it('Returns the expected formatted GraphQL query when a simple schema is passed', () => {
    const expectedFormat = `{
    getName {
      id,name
    }
  }`

    const quibFormat = quib({
      getName: {
        id: '',
        name: ''
      }
    })

    expect(quibFormat).toBe(expectedFormat)
  })

  it('Returns the expected formatted GraphQL query when a nested object is passed as the schema', () => {
    const expectedFormat = `{
    getName {
      details {levelTwo,moreDetails {andAnotherDetailLevel,levelThree}},id,levelOne,name
    }
  }`

    const quibFormat = quib({
      getName: {
        details: {
          levelTwo: '',
          moreDetails: {
            andAnotherDetailLevel: '',
            levelThree: ''
          }
        },
        id: '',
        levelOne: '',
        name: ''
      }
    })

    expect(quibFormat).toBe(expectedFormat)
  })

  it('Returns the expected formatted GraphQL query when multiple objects are passed as the schema', () => {
    const expectedFormat = `{
    getAllArtists {
      artist {name,power}
    }queryArtists {
      id,image,name
    }
  }`

    const quibFormat = quib({
      getAllArtists: {
        artist: {
          name: '',
          power: false
        }
      },

      queryArtists: {
        id: '',
        image: '',
        name: ''
      }
    })

    expect(quibFormat).toBe(expectedFormat)
  })

  it('Returns the expected formatted GraphQL query with variables when arguments are passed', () => {
    const expectedFormat = `{
    getAllArtists (limit:10) {
      artist {name,power}
    }queryArtists (name:"My name") {
      id,image,name
    }
  }`

    const quibFormat = quib({
      getAllArtists: {
        artist: {
          name: '',
          power: false
        }
      },

      queryArtists: {
        id: '',
        image: '',
        name: ''
      }
    }, {
      args: {
        getAllArtists: {
          limit: 10
        },

        queryArtists: {
          name: 'My name'
        }
      }
    })

    expect(quibFormat).toBe(expectedFormat)
  })
})
