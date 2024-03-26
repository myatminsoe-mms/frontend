const multisortConvert = (data) => {
  const order = []
  if (Array.isArray(data)) {
    data.forEach((param) => {
      order.push({
        column: param.field,
        order: param.order === 1 ? 'asc' : 'desc'
      })
    })
  }
  return order
}

export { multisortConvert }
