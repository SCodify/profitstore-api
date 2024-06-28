const testData = [
  {
    id: 1,
    nombre: "Test #1",
    detalle: "Detalle 1"
  },
  {
    id: 2,
    nombre: "Test #2",
    detalle: "Detalle 2"
  },
  {
    id: 3,
    nombre: "Test #3",
    detalle: "Detalle 3"
  },
]

const controller = {
  getTest: async (req, res) => {
    res.json({
      message: "Test GET",
      testData
    })
  },

  getTestItem: async (req, res) => {
    const { tid } = req.params
    const test = testData.find(itemTest => itemTest.id == tid)

    if (!test) {
      return res.status(404).json({ error: `Nos se encontró el test id: ${tid}` })
    }

    res.json({
      message: `${test.nombre} GET`,
    })
  },

  postTest: async (req, res) => {
    const testBody = req.body

    const id = testData[testData.length - 1].id + 1

    const test = {
      id: id,
      nombre: testBody.nombre,
      detalle: testBody.detalle
    }

    testData.push(test)
    res.json({
      message: "Test POST",
      testData
    })
  },

  putTest: async (req, res) => {
    const { tid } = req.params
    const { nombre, detalle } = req.body

    const testItem = testData.find(itemTest => itemTest.id == tid)
    if (!testItem) {
      return res.status(404).json({ error: `Nos se encontró el test id: ${tid}` })
    }

    let camposFaltantes = [];

    if (detalle && nombre) {
      testItem.detalle = detalle
      testItem.nombre = nombre
    } else {
      if (!detalle) camposFaltantes.push('detalle')
      if (!nombre) camposFaltantes.push('nombre')

      return res.status(404).json({ error: `Falta: ${camposFaltantes.join(", ")}` })
    }

    res.json({
      message: "Test PUT",
      testItem
    })
  },

  patchTest: async (req, res) => {
    const { tid } = req.params
    const { nombre, detalle } = req.body

    const testItem = testData.find(itemTest => itemTest.id == tid)
    if (!testItem) {
      return res.status(404).json({ error: `Nos se encontró el test id: ${tid}` })
    }

    if (nombre) {
      testItem.detalle = detalle
    }

    if (detalle) {
      testItem.nombre = nombre
    }

    res.json({
      message: "Test PATCH",
      testItem
    })
  },

  deleteTest: async (req, res) => {
    const { tid } = req.params

    const testItem = testData.find(itemTest => itemTest.id == tid)
    if (!testItem) {
      return res.status(404).json({ error: `Nos se encontró el test id: ${tid}` })
    }

    const testIndex = testData.findIndex(itemTest => itemTest.id == tid)
    testData.splice(testIndex, 1)

    res.json({
      message: "Test DELETE",
      testItem
    })
  }
}

module.exports = controller