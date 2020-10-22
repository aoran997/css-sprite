import pngquant
from flask import Flask, jsonify, send_from_directory, send_file
from flask import request, make_response
from flask_cors import CORS
import zipfile
import os
app = Flask(__name__)
pngquant.config('/usr/local/pngquant/pngquant', 70, 80, 1, 8, 'tmp.png', 1)


@app.route('/uploads', methods=['GET', 'POST'])
def upload():
    files = request.files.getlist('files')
    z = zipfile.ZipFile('./tmpFile/download/smallImage.zip',
                        'w', zipfile.ZIP_DEFLATED)
    for f in files:
        print(f.filename)
        file_path = os.path.join('./tmpFile/old', f.filename)
        f.save(file_path)
        pngquant.quant_image('./tmpFile/old/' + f.filename,
                             './tmpFile/new/' + f.filename, 1, 8)
        z.write(os.path.join('./tmpFile/new', f.filename), f.filename)
    z.close()
    print('压缩完成')
    for r in os.listdir('./tmpFile/old'):
        os.remove('./tmpFile/old/' + r)
    for r in os.listdir('./tmpFile/new'):
        os.remove('./tmpFile/new/' + r)
    response = make_response(send_from_directory(
        './', 'smallImage.zip', as_attachment=True))
    response.headers['Access-Control-Expose-Headers'] = 'Content-Disposition'
    return response


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
    app.run()
