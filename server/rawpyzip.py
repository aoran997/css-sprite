import copy
import pngquant
from flask import Flask, jsonify, send_from_directory, send_file, json
from flask import request, make_response
from flask_cors import CORS
import os
import algo
from io import BytesIO
from PIL import Image
import imgToBase64
app = Flask(__name__)
pngquant.config('/usr/local/bin/pngquant', 70, 80, 1, 8, 'tmp.png', 1)


@app.route('/uploads', methods=['GET', 'POST'])
def upload():
    files = request.files.getlist('files')
    result = []
    base64s = []
    newImages = []
    for f in files:
        file_path = os.path.join('./tmpFile/old', f.filename)
        f.save(file_path)
        pngquant.quant_image('./tmpFile/old/' + f.filename,
                             './tmpFile/new/' + f.filename, 1, 8)
        newImages.append(Image.open('./tmpFile/new/' + f.filename))
        imgInfo = imgToBase64.image_to_base64(
            os.path.join('./tmpFile/new', f.filename))
        base64s.append(imgInfo['base64'])
        im = imgInfo['img']
        result.append([im.size[0], im.size[1]])

    algoData = algo.FORP(result)
    canvas = Image.new(
        'RGBA', (algoData['w'], algoData['h']), (255, 255, 255, 0))

    for m in algoData['r']:
        canvas.paste(newImages[m['p']], (m['x'], m['y']))

    canvas.save('./tmpFile/new/temp.png')
    assembleBase64 = imgToBase64.image_to_base64(
        './tmpFile/new/temp.png')['base64']
    removeFile()
    return json.dumps({'newImages': base64s, 'assembleImg': assembleBase64, 'algoData': algoData}, ensure_ascii=False)


@ app.route('/', methods=['GET'])
def hello():
    return 'hello'


def removeFile():
    for r in os.listdir('./tmpFile/old'):
        os.remove('./tmpFile/old/' + r)
    for r in os.listdir('./tmpFile/new'):
        os.remove('./tmpFile/new/' + r)


if __name__ == '__main__':
    if not os.path.exists('./tmpFile'):
        os.mkdir('./tmpFile')
    if not os.path.exists('./tmpFile/new'):
        os.mkdir('./tmpFile/new')
    if not os.path.exists('./tmpFile/old'):
        os.mkdir('./tmpFile/old')
    if not os.path.exists('./tmpFile/download'):
        os.mkdir('./tmpFile/download')
    CORS(app, supports_credentials=True)
    app.run(host='0.0.0.0')
