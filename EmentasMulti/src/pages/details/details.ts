import { Component } from '@angular/core';
import { Ementas } from '../../providers/ementas';
import { HomePage } from '../../pages/home/home';
import { MapPage } from '../../pages/map/map';
import { AlertController, LoadingController, NavController, Platform, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {

  menu: string[];
  name: string;
  headers: string[];
  cached_data: any;
  homePage = HomePage;
  mapPage = MapPage;
  entries: Array<any> = [];

  constructor(
    public alertController: AlertController,
    public loadingCtrl: LoadingController,
    public nav: NavController,
    public platform: Platform,
    public ementas: Ementas,
    public navParams: NavParams
  ) {
    this.name = navParams.get("name")
    this.menu = navParams.get("menu")
    this.headers = navParams.get("headers")
    this.cached_data = navParams.get("cacheddata")
    for (let i = 0; i < this.menu.length; i++) {
      this.entries.push({ 'menu': this.menu[i], 'header': this.headers[i] });
    }
  }
 

  goBack() {
    this.nav.push(this.homePage,
      { cacheddata: this.cached_data }
    )
  }

  getMap() {
    this.nav.push(this.mapPage,
      {
        cacheddata: this.cached_data,
        name: this.name,
        menu: this.menu,
        headers: this.headers
      }
    )
  }

  showAlert(message: string) {
    let alert = this.alertController.create({
      title: 'Error',
      subTitle: 'Source: services.web.ua.pt',
      message: message,
      buttons: [{ text: 'OK' }]
    });
    alert.present();
  }

  ionViewDidLoad() {
    //no action required
  }
}
