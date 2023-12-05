module.exports = {
    input1: {
      "matchid": "15cd3b53255-4d339254-6948-4052-bd0a-cc98646cadaf",
      "preferences": [
        {
          "name": "A",
          "value": "1",
          "lastUpdated": 1498467550
        },
        {
          "name": "B",
          "value": "2",
          "lastUpdated": 1498532227
        }
      ]
    },
    input2: {
      "matchid": "15cd3b53255-4d339254-6948-4052-bd0a-cc98646cadaf",
      "preferences": [
        {
          "name": "B",
          "value": "3",
          "lastUpdated": 1498467550
        },
        {
          "name": "C",
          "value": "4",
          "lastUpdated": 1498532227
        }
      ]
    },
    output: {
      cache1: ['A','A_updated','B','B_updated'],
      cache2: ['B','B_updated','C','C_updated'],
      deleted: ['A','A_updated']
    }
};