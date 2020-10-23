import base64
from PIL import Image
from io import BytesIO
import re
import os

print('s')


def image_to_base64(image_path):
    img = Image.open(image_path)
    output_buffer = BytesIO()
    img.save(output_buffer, format=img.format)
    byte_data = output_buffer.getvalue()
    base64_str = 'data:image/' + img.format.lower() + ';base64,' + \
        str(base64.b64encode(byte_data).decode('ascii'))
    return {
        'base64': base64_str,
        'img': img
    }
