import { Component, OnInit } from '@angular/core';
import {NgFor, NgIf} from "@angular/common";

@Component({
  selector: 'docs-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less'],
  imports: [NgIf,NgFor],
  standalone: true
})
export class AdminComponent implements OnInit {

  fundraisers: any[] = []
  constructor() {}
  tableList: any[] = []
  getList() {
    // @ts-ignore
    const category = document.querySelector('#category_select').value
    fetch(`http://localhost:8085/api/search?category=${category}&organizer=''`)
      .then(response => response.json())
      .then((fundraisers:any) => {
        console.log('fundraisers', fundraisers)
        this.tableList = fundraisers.data
      })
      .catch(error => console.error('Error fetching fundraisers:', error));
  }

  editItem(id:any) {
    window.location.href = `/addFundraisers?id=${id}`;
  }

  deleteItem(id: any) {
    fetch(`http://localhost:8085/api/removeFundraiser/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        window.location.reload()
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  getCategory() {
    fetch('http://localhost:8085/api/category').then(res => {
      return res.json()
    }).then(response => {
      const list: any = document.querySelector('#category_select')
      let text = `<option value="">All</option>`
      response.data.forEach((item: { CATEGORY_ID: string; NAME: string; }) => {
        text += `<option value="` + item.CATEGORY_ID + `">` + item.NAME + `</option>`
      })
      list.innerHTML = text
    })
  }

  ngOnInit(): void {
    this.getCategory()
    this.getList()
  }
}
