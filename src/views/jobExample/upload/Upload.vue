<template>
    <div class="diy-upload">
        <input
            ref="input"
            type="file"
            name="image"
            accept="image/*"
            @change="setImage"
        />

        <div class="content">
            <section class="cropper-area" style="width: 240px">
                <div class="img-cropper">
                    <vue-cropper
                        ref="cropper"
                        :aspect-ratio="1 / 1"
                        :src="imgSrc"
                        :minContainerWidth="240"
                        :minContainerHeight="200"
                        :container-style = "{ 'width': '100%', 'height': '200px' }"
                        preview=".preview"
                    />
                </div>
                <div class="actions">
                    <el-button size="small" @click.prevent="showFileChooser">上传头像</el-button>
                    <el-button size="small" @click.prevent="zoom(0.2)">放大</el-button>
                    <el-button size="small" @click.prevent="zoom(-0.2)">缩小</el-button>
                </div>
                <el-button size="small" type="primary" style="margin-top: 8px;" @click="cropperStart">提交</el-button>
            </section>
            <!--<section class="preview-area">
                <p>Preview</p>
                <div class="preview" />
                <p>Cropped Image</p>
                <div class="cropped-image">
                    <img
                        v-if="cropImg"
                        :src="cropImg"
                        alt="Cropped Image"
                    />
                    <div v-else class="crop-placeholder" />
                </div>
            </section>-->
        </div></div>
</template>

<script>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
export default {
    name: 'Upload',
    components: {VueCropper},
    data() {
        return {
            imgSrc: require('../../../assets/img/demo-1-bg.jpg'),
            cropImg: '',
            data: null
        };
    },
    methods: {
        cropImage() {
            // get image data for post processing, e.g. upload or setting image src
            this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
        },
        flipX() {
            const dom = this.$refs.flipX;
            let scale = dom.getAttribute('data-scale');
            scale = scale ? -scale : -1;
            this.$refs.cropper.scaleX(scale);
            dom.setAttribute('data-scale', scale);
        },
        flipY() {
            const dom = this.$refs.flipY;
            let scale = dom.getAttribute('data-scale');
            scale = scale ? -scale : -1;
            this.$refs.cropper.scaleY(scale);
            dom.setAttribute('data-scale', scale);
        },
        getCropBoxData() {
            this.data = JSON.stringify(this.$refs.cropper.getCropBoxData(), null, 4);
        },
        getData() {
            this.data = JSON.stringify(this.$refs.cropper.getData(), null, 4);
        },
        move(offsetX, offsetY) {
            this.$refs.cropper.move(offsetX, offsetY);
        },
        reset() {
            this.$refs.cropper.reset();
        },
        setCropBoxData() {
            if (!this.data) return;
            this.$refs.cropper.setCropBoxData(JSON.parse(this.data));
        },
        setData() {
            if (!this.data) return;
            this.$refs.cropper.setData(JSON.parse(this.data));
        },
        setImage(e) {
            const file = e.target.files[0];
            if (file.type.indexOf('image/') === -1) {
                alert('Please select an image file');
                return;
            }
            if (typeof FileReader === 'function') {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.imgSrc = event.target.result;
                    // rebuild cropperjs with the updated source
                    this.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Sorry, FileReader API not supported');
            }
        },
        showFileChooser() {
            this.$refs.input.click();
        },
        zoom(percent) {
            this.$refs.cropper.relativeZoom(percent);
        },
        // 确定裁剪
        cropperStart() {
            this.cropperUploadloading = true;
            // get image data for post processing, e.g. upload or setting image src
            this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
            console.log(this.cropImg);
            // 上传裁剪后的图片
            this.normTagIcoUpload2();
        },

        // 上传图片
        normTagIcoUpload2() {
            const that = this;
            const formData = new FormData();

            // base64转文件
            const imgFile = that.dataURLtoFile(that.cropImg, that.cropperForm.file_name);
            // console.log("正在上传的文件:");
            // console.log(imgFile);
            // return false;
            formData.append('oldFile', that.imgSrc);// 本地原图地址
            formData.append('file', imgFile);
            formData.append('purpose', that.cropperForm.purpose);
            formData.append('group_id', that.cropperForm.group_id);
            formData.append('fileName', that.cropperForm.file_name);
            const config = {'Content-Type': 'multipart/form-data'};

            that.$http
                .post('/upload/CropperSaveImage', formData, {
                    headers: config
                }).then((res) => {
                    that.cropperUploadloading = false;

                    if (res.data.ok) {
                        that.$message('图片裁剪成功');
                    } else {
                        that.$message('图片裁剪失败');
                    }

                    // 异步更新数据
                    that.cropperVisible = false;
                    that.pictureData();
                // that.$router.push('/api/List');
                })
                .catch((error) => {
                    that.$message('ajax error');
                });

            // 初始化默认数据
        },
        //  blob文件流上传方式
        blobUpload() {
            this.$refs.cropper.getCroppedCanvas().getCroppedCanvas().toBlob((blob) => {
                const formData = new FormData();

                // Pass the image file name as the third parameter if necessary.
                formData.append('croppedImage', blob/*, 'example.png' */);

                // Use `jQuery.ajax` method for example
                $.ajax('/path/to/upload', {
                    method: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success() {
                        console.log('Upload success');
                    },
                    error() {
                        console.log('Upload error');
                    }
                });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
    .diy-upload{
        input[type="file"] {
            display: none;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0 5px 0;
        }
        .header h2 {
            margin: 0;
        }
        .header a {
            text-decoration: none;
            color: black;
        }
        .content {
            display: flex;
            justify-content: space-between;
        }
        .cropper-area {
            width: 614px;
        }
        .actions {
            margin-top: 1rem;
        }
        .actions a {
            display: inline-block;
            padding: 5px 15px;
            background: #0062CC;
            color: white;
            text-decoration: none;
            border-radius: 3px;
            margin-right: 1rem;
            margin-bottom: 1rem;
        }
        textarea {
            width: 100%;
            height: 100px;
        }
        .preview-area {
            width: 307px;
        }
        .preview-area p {
            font-size: 1.25rem;
            margin: 0;
            margin-bottom: 1rem;
        }
        .preview-area p:last-of-type {
            margin-top: 1rem;
        }
        .preview {
            width: 100%;
            height: calc(372px * (9 / 16));
            overflow: hidden;
        }
        .crop-placeholder {
            width: 100%;
            height: 200px;
            background: #ccc;
        }
        .cropped-image img {
            max-width: 100%;
        }
    }

</style>
