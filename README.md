# nexrender-action-hiec-convert

A predownload action that checks if the file being submitted is a hiec image format and converts to png for use in a render


  "actions": {
    "predownload": [
      {
        "module": "nexrender-action-hiec-convert",
        "dir": "/some/output/location" //optional if you're using file:// 
        "layers": [
          "image_1"
        ]
      }
    ]
  }