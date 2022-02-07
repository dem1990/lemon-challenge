export const serviceResponse = (data = {}) => ({
  data: {
    message: 'foo',
    subtitle: 'bar'
  },
  ...data
})
