import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, Platform } from 'ionic-angular';
//import { Chart } from 'chart.js';
import { UserData } from '../../providers/user-data';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public person: { name: string, phone: string, userId: string};
  profilePages = "trends";

  userHasWallet = false;
  walletData:any;
  walletCoins = [{ 'name': 'Bitcoin', 'value': 0, 'icon': 'bitcoin.png' },
  { 'name': 'Ether', 'value': 0, 'icon': 'ether.png' },
  { 'name': 'Angur', 'value': 0, 'icon': 'angur.png' },
  { 'name': 'Dash', 'value': 0, 'icon': 'dash.png' }
  ];
  walletData2: any;
  balancedata: any;
  walletid: any;
  balance: any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public user:UserData,
    private alertCtrl: AlertController,
    private rp: RestProvider,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform) {
    this.person = { name:"" , phone: "", userId: ""};
    this.profilePages = "wallet";
  
  }

  ionViewDidLoad() {
    this.user.getPhone().then((phone) => { 
      this.person.phone = phone;
    });
    this.user.getUsername().then((userName) => {
      this.person.name = userName;
    });
    this.user.getUserId().then((userId) => {
      this.person.userId = userId;
      console.log(userId);
      
      this.userHasWalletInSystem();
    });
    


  }
 checkProfilePage(pageName){
     return !this.userHasWallet;
  }
  changeProfilePage(pageName){
    this.profilePages = pageName;
 
  }
  gotoPage(page, data:any = null) {
    if(data===null)
    this.navCtrl.push(page);
    else{
      console.log(data);
      
      this.navCtrl.push(page, {'data': data});
    }
 
  }
  hasWallet(){
    return this.userHasWallet;
     
  }
  getWallet() {
      this.rp.getData('wallet/tbtc/' + this.walletid).then(data => {
        this.balancedata = data;
        this.balance = parseInt(this.balancedata.response.spendableBalance)/100000000;
        console.log(this.balance);
        this.walletCoins[0].value = this.balance;
      });
  }
    userHasWalletInSystem(){
      this.rp.getData('wallet/' + this.person.userId).then(data => {
        console.log(data);
        this.walletData = data;
        console.log(this.walletData.error);
        if (this.walletData.error === undefined) {
          this.walletid = this.walletData.response.walletId;
          this.userHasWallet = true;
          this.getWallet();
        }
        
      });
    }
  
  createWallet(){
    this.presentPrompt();
    console.log("Wallet Created!");
    
  }
  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Create New wallet',
      inputs: [
        {
          name: 'label',
          placeholder: 'Enter Wallet Name'
        },
        {
          name: 'password',
          placeholder: 'Choose a Passphrase',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Maybe Later',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Next',
          handler: data => {
            //to call api
            this.rp.addData('wallet/' + this.person.userId, {
              "coin": "tbtc",
              "label": data.label,
              "password": data.password}).then(data => {
                this.userHasWallet = true;
                console.log(data);
                this.getWallet();
              })
            
           
          }
        }
      ]
    });
    alert.present();
  }
  doRefresh(refresher) {
    setTimeout(() => {
      this.ionViewDidLoad();
      refresher.complete();
    }, 2000);
  }


  paymentmethodPrompt() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Choose Payment Mode',
      cssClass: 'action-sheets-basic-page',
      buttons: [
         {
          text: 'Send to Wallet',
          icon: !this.platform.is('ios') ? 'at' : null,
          handler: () => {
            this.gotoPage("SendcoinPage", 'walletid');
            //console.log('Archive clicked');
          }
        },
        {
          text: 'Scan QR',
          icon: !this.platform.is('ios') ? 'qr-scanner' : null,
          handler: () => {
            //console.log('Archive clicked');
            this.gotoPage("SendcoinPage", 'qrcode');
          }
        },
        {
          text: 'Select from contacts', 
          //icon: 'contacts',
          icon: !this.platform.is('ios') ? 'contacts' : null,
          handler: () => {
            this.gotoPage("SendcoinPage", 'contacts');
           // console.log('Archive clicked');
          }
        },
         {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }


}
