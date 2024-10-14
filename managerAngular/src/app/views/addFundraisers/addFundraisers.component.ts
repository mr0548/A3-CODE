import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'docs-one',
  templateUrl: './addFundraisers.component.html',
  styleUrls: ['./addFundraisers.component.less'],
})
export class AddFundraisersComponent implements OnInit {
  constructor() {}
  fileInput = null
  preview = null
  fundraiser_id = null
  init():void{
    // @ts-ignore
    this.fileInput = document.querySelector('#file-input');
    // @ts-ignore
    this.preview = document.querySelector('#preview');
    this.getId()
    this.getCategory();
    this.setupFileUpload();
  }

  getId() {
    const urlParams = new URLSearchParams(window.location.search);
    // @ts-ignore
    this.fundraiser_id = urlParams.get('id');
    if(this.fundraiser_id) {
      this.getDetail(this.fundraiser_id)
    }
  }
  getDetail(id: any) {
    const CAPTION = document.querySelector('#CAPTION')
    const ORGANIZER = document.querySelector('#ORGANIZER')
    const category = document.querySelector('#category_select')
    const CITY = document.querySelector('#CITY')
    const STATUS = document.querySelector('#STATUS')
    const TARGET = document.querySelector('#TARGET')
    const IMAGE = document.querySelector('#preview')
    const DESCRIBE = document.querySelector('#DESCRIBE')
    fetch('http://localhost:8085/api/fundraiser/' + id).then(res => {
      return res.json()
    }).then(response => {
      var data = response.data[0]
      // @ts-ignore
      CAPTION.value = data.CAPTION
      // @ts-ignore
      ORGANIZER.value = data.ORGANIZER
      // @ts-ignore
      category.value = data.CATEGORY_ID
      // @ts-ignore
      CITY.value = data.CITY
      // @ts-ignore
      STATUS.value = data.ACTIVE
      // @ts-ignore
      TARGET.value = data.TARGET_FUNDING
      // @ts-ignore
      IMAGE.src = data.URL
      // @ts-ignore
      DESCRIBE.value = data.DESCRIBE
    })
  }

  uploadImage() {
    // @ts-ignore
    const file = this.fileInput.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      fetch('http://localhost:8085/api/uploadImage', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          // @ts-ignore
          let CAPTION = document.querySelector('#CAPTION').value
          // @ts-ignore
          let organizer = document.querySelector('#ORGANIZER').value
          // @ts-ignore
          let category = document.querySelector('#category_select').value
          // @ts-ignore
          let city = document.querySelector('#CITY').value
          // @ts-ignore
          let status = document.querySelector('#STATUS').value
          // @ts-ignore
          let target = document.querySelector('#TARGET').value
          // @ts-ignore
          let describe = document.querySelector('#DESCRIBE').value
          const postForm = {
            caption: CAPTION,
            organizer: organizer,
            category: category,
            city: city,
            status: status,
            target: target,
            describe: describe,
            url: data.data,
            id: undefined
          }
          if (this.fundraiser_id) {
            postForm.id = this.fundraiser_id
            fetch('http://localhost:8085/api/updateFunfraiser', {
              method: 'PUT',
              body: JSON.stringify(postForm),
              headers: {
                'Content-Type': 'application/json'
              }
            })
              .then(response => response.json())
              .then(data => {
                console.log('success');
              })
          } else {
            fetch('http://localhost:8085/api/addFunfraiser', {
              method: 'POST',
              body: JSON.stringify(postForm),
              headers: {
                'Content-Type': 'application/json'
              }
            })
              .then(response => response.json())
              .then(data => {
                console.log('success');
              })
          }
          alert('UPLOAD SUCCESS!')
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      alert('Please select an image first.');
    }
  }

  setupFileUpload() {
    // @ts-ignore
    this.fileInput.addEventListener('change',  (e: { target: { files: any[]; }; }) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          let preview1 = document.querySelector('#preview')
          // @ts-ignore
          preview1.src = e.target.result
          // @ts-ignore
          preview1.style.display = 'block';
        }
        reader.readAsDataURL(file);
        this.uploadImage();
      }
    });
  }

  getCategory() {
    fetch('http://localhost:8085/api/category').then(res => {
      return res.json()
    }).then(response => {
      const list = document.querySelector('#category_select')
      let text = `<option value="">All</option>`
      response.data.forEach((item: { CATEGORY_ID: string; NAME: string; }) => {
        text += `<option value="` + item.CATEGORY_ID + `">` + item.NAME + `</option>`
      })
      // @ts-ignore
      list.innerHTML = text
    })
  }
  ngOnInit(): void {
    this.init()
  }
}
