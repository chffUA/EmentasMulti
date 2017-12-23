import { Component, ViewChild, ElementRef } from '@angular/core';
import { Ementas } from '../../providers/ementas';
import { DetailsPage } from '../../pages/details/details';
import { AlertController, LoadingController, NavController, Platform, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import leaflet from 'leaflet';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  detailsPage = DetailsPage;
  menu: string[];
  name: string;
  headers: string[];
  cached_data: any; //saved for the current session

  constructor(
    public alertController: AlertController,
    public loadingCtrl: LoadingController,
    public nav: NavController,
    public platform: Platform,
    public ementas: Ementas,
    public navParams: NavParams,
    public storage: Storage,
  ) {
    this.name = navParams.get("name")
    this.menu = navParams.get("menu")
    this.headers = navParams.get("headers")
    this.cached_data = navParams.get("cacheddata")
  }

  goBack() {
    this.nav.push(this.detailsPage,
      {
        cacheddata: this.cached_data,
        name: this.name,
        menu: this.menu,
        headers: this.headers
      }
    )
  }

  loadmap() {
    this.map = leaflet.map("map");
    leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hmZiIsImEiOiJjamJqYjdsNjMydzVnMnBtb3UzaDllZ2EzIn0.QFQp0MnXyhrRJXR0Y-hZHA', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 26,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiY2hmZiIsImEiOiJjamJqYjdsNjMydzVnMnBtb3UzaDllZ2EzIn0.QFQp0MnXyhrRJXR0Y-hZHA'
    }).addTo(this.map);

    //default = coordenadas da UA
    let lat = 40.6303024;
    let lon = -8.657506;

    if (this.name === "Refeitório de Santiago") {
      lat = 40.6305745;
      lon = -8.6591132;
    } else if (this.name === "Refeitório do Crasto") {
      lat = 40.624534;
      lon = -8.656996;
    } else if (this.name === "Snack-Bar/Self") {
      lat = 40.631227;
      lon = -8.655418;
    }
    this.map.setView([lat, lon], 17); 
    let marker = leaflet.marker([lat, lon]).addTo(this.map);
  }
  
  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.loadmap();
    });
  }

  ionViewCanLeave() {
    document.getElementById("map").outerHTML = "";
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
}
