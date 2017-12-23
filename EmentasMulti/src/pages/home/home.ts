import { Component } from '@angular/core';
import { Ementas } from '../../providers/ementas';
import { DetailsPage } from '../../pages/details/details';
import { AlertController, LoadingController, NavController, Platform, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  detailsPage = DetailsPage
  c_items: Array<any> = [];
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
    this.cached_data = navParams.get("cacheddata");
    if (this.cached_data == null) {
      this.storage.get('stored_ementa').then((val) => {
        this.cached_data = val;
      });
    }  
    
  }
  
  ionViewDidLoad() {
    this.platform.ready().then(() => {
      document.addEventListener('resume', () => { this.getCantinas();});
      this.getCantinas();
    });
  }

  refreshPage() {
    this.cached_data = null;
    this.storage.remove('stored_ementa');
    this.showCurrent();
  }

  getCantinas() {
    this.showCurrent();
  }

  buttonClick(item) {
    this.nav.push(this.detailsPage,
      { name: item.name, menu: item.menu, headers: item.headers, cacheddata: this.cached_data }
    )
  }

  showCurrent() {
    this.c_items = [];
    //check cache
    if (this.cached_data != null) {
      this.c_items = this.formatData(this.cached_data);
      return;
    }
    //Create the loading indicator
    let loader = this.loadingCtrl.create({
      content: "Retrieving information..."
    });
    //Show the loading indicator
    loader.present();
    this.ementas.getCurrent().then(
      data => {
        //Hide the loading indicator
        loader.dismiss();
        
        if (data) {
          this.cached_data = data;
          this.storage.set("stored_ementa", data);
          this.c_items = this.formatData(data);
        } else {
          console.error('Error retrieving canteen data: Data object is empty');
        }
      },
      error => {
        //Hide the loading indicator
        loader.dismiss();
        console.error('Error retrieving canteen data');
        console.dir(error);
        this.showAlert(error);
      }
    );
  }

  private formatData(data): any {
    let tmpArray = [];

    if (!data.menus) {
      return tmpArray;
    }
    let set = new Set()
    let array: string[] = data.menus.menu

    for (let i = 0; i < array.length;i++)
      set.add((array[i])[Object.keys(array[i])[0]].canteen) //way to access @attributes

    set.forEach(function (item) { //item is a string with the name
      let headers : string[] = []
      let menu : string[] = []

      for (let i = 0; i < array.length; i++) { //menu array
        let attributes = (array[i])[Object.keys(array[i])[0]]
        let items = (array[i])[Object.keys(array[i])[1]]
        let n = attributes.canteen //name

        if (item === n) {
          headers.push(this.translate(attributes.weekday) + " - " + attributes.meal)
          let elem = ""

          let disabled = attributes.disabled

          if (!(disabled === "0")) { //no menu
            elem += disabled + "\n"
          } else {
            let itemarray: string[] = items.item
            for (let x = 0; x < itemarray.length; x++) {
              if (typeof itemarray[x] === 'string') {
                elem += itemarray[x] + "\n"
              }
            }
          }
          menu.push(elem)
        }
      }

      tmpArray.push({ 'name': item, 'menu': menu, 'headers': headers });
    }, this);
      
    return tmpArray;
  }

  private translate(s: string): string {
    if (s === "Sunday") return "Domingo"
    else if (s === "Monday") return "Segunda-feira"
    else if (s === "Tuesday") return "Terça-feira"
    else if (s === "Wednesday") return "Quarta-feira"
    else if (s === "Thursday") return "Quinta-feira"
    else if (s === "Friday") return "Sexta-feira"
    else return "Sábado"
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
