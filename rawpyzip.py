# import pngquant

# pngquant.config('/usr/local/pngquant/pngquant', 70, 80, 1, 8, 'tmp.png', 1)
# pngquant.quant_image('./oldimg/untitled.png', './newimg/untitled.png', 1, 8)

from flask import Flask, jsonify
from flask import request
from flask_cors import CORS
app = Flask(__name__)


@app.route('/uploads', methods=['GET', 'POST'])
def upload():
    print('请求方式为------->', request.method)
    args = request.values.get("name") or "args没有参数"
    print('args参数是------->', args)
    form = request.values.get('usr') or 'form没有参数'
    print('form参数是------->', form)
    files = request.files.getlist('files')
    for f in files:
        print(f.filename)
    return jsonify(args=args, form=form)


if __name__ == '__main__':
    CORS(app, supports_credentials=True)
    app.run()
