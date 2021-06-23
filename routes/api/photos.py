from flask import Blueprint, send_file, redirect, request
from tennis.aws import list_files, download_file, upload_file
from datetime import datetime
from ..models import db, User
import os
import time
from flask_login import login_required, current_user


photos = Blueprint('photos', __name__)

UPLOAD_FOLDER = 'uploads'
BUCKET = "tennis-photos"


@photos.route('', methods=['POST'])
# @login_required
def upload():
    user = User.query.get(current_user.id)
    if request.method == "POST":
        print("WE Here", request.files)
        f = request.files['image']
        f.filename = change_name(f.filename)
        f.save(os.path.join(UPLOAD_FOLDER, f.filename))
        upload_file(f"uploads/{f.filename}", BUCKET)
        user.photo_url = f'https://tennis-photos.s3.us-east-2.amazonaws.com/uploads/{f.filename}'
        user.updated_at = datetime.now()
        db.session.commit()
        return {'photo_url': user.photo_url}


def change_name(file_name):
    return f"{time.ctime().replace(' ', '').replace(':', '')}.png"
