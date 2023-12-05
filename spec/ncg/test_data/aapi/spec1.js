module.exports = {
    input: {
      "matchid": "15cd3b53255-4d339254-6948-4052-bd0a-cc98646cadaf",
      "preferences": [
        {
          "name": "opt-out",
          "value": "1",
          "lastUpdated": 1498467550
        },
        {
          "name": "dfp_audience",
          "value": "90716530",
          "lastUpdated": 1498532227
        }
      ],
      "ids": "null",
      "features": "null",
      "segs": "null",
      "metadata": {
        "pepe": "aaa"
      },
      "created": 1498532263480,
      "updated": 1498532263480,
      "groupids": [
        {
          "lookupid": "_pcsid_22729097",
          "preferences": [
            {
              "name": "postcode",
              "value": "2036",
              "lastUpdated": 1498435743
            }
          ],
          "ids": "null",
          "features": "null",
          "segs": "null",
          "metadata": {
            "nc": [
              "CN20",
              "CN21"
            ],
            "weather": {
              "day": 0,
              "day_name": "Tuesday",
              "date": "2017-06-27",
              "min": 8,
              "max": 16,
              "icon_phrase": "Cloud increasing",
              "icon_filename": "cloud_increasing.gif",
              "rain_prob": 30
            }
          },
          "created": 1498470499199,
          "updated": 1498470499199
        }
      ]
    },
    output: [
        {
            "postcode": {
                "name": "postcode",
                "value": "2036",
                "lastUpdated": 1498435743
            },
            "nc": {
                "name": "nc",
                "value": [
                    "CN20",
                    "CN21"
                ]
            },
            "weather": {
                "name": "weather",
                "value": {
                    "day": 0,
                    "day_name": "Tuesday",
                    "date": "2017-06-27",
                    "min": 8,
                    "max": 16,
                    "icon_phrase": "Cloud increasing",
                    "icon_filename": "cloud_increasing.gif",
                    "rain_prob": 30
                }
            },
            "opt-out": {
                "name": "opt-out",
                "value": "1",
                "lastUpdated": 1498467550
            },
            "dfp_audience": {
                "name": "dfp_audience",
                "value": "90716530",
                "lastUpdated": 1498532227
            },
            "pepe": {
                "name": "pepe",
                "value": "aaa"
            }
        },
        {
            "{PREFIX}postcode": 2036,
            "{PREFIX}postcode_updated": 1498435743,
            "{PREFIX}nc": "CN20,CN21",
            "{PREFIX}weather.day": 0,
            "{PREFIX}weather.day_name": "Tuesday",
            "{PREFIX}weather.date": "2017-06-27",
            "{PREFIX}weather.min": 8,
            "{PREFIX}weather.max": 16,
            "{PREFIX}weather.icon_phrase": "Cloud increasing",
            "{PREFIX}weather.icon_filename": "cloud_increasing.gif",
            "{PREFIX}weather.rain_prob": 30,
            "{PREFIX}opt-out": 1,
            "{PREFIX}opt-out_updated": 1498467550,
            "{PREFIX}dfp_audience": 90716530,
            "{PREFIX}dfp_audience_updated": 1498532227,
            "{PREFIX}pepe": "aaa"
        }
    ]
};