import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserData } from '../../providers/user-data';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1 = 'ProfilePage';
  tab2 = 'StoriesPage';
  tab3 = 'FriendsPage';

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private user: UserData) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }
  logout() {
    //this.app.getRootNav().push('SupportPage');
    this.user.logout();
  }

  
}
