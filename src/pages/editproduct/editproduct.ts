import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  LoadingController
} from 'ionic-angular';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  RestProvider
} from '../../providers/rest/rest';
import * as firebase from 'firebase';
import {
  UserData
} from '../../providers/user-data';

import {
  ImageuploaderProvider
} from '../../providers/imageuploader/imageuploader';


@IonicPage()
@Component({
  selector: 'page-editproduct',
  templateUrl: 'editproduct.html',
})
export class EditproductPage {

  public form: FormGroup;
  storyImage: any;
  contentData: any;
  datacheck:any;
  iddata:any;
  product:any
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private _FB: FormBuilder,
    public rs: RestProvider,
    public loadingCtrl: LoadingController,
    public user: UserData,
    private _IMG: ImageuploaderProvider, ) {
      
    
    this.form = this._FB.group({
      'contentText': ['', Validators.required],
      'contentTextDescription': ['', Validators.required],
      'price': ['', Validators.required],
      'quantity': ['', Validators.required],
    });
   
  }

  ionViewWillEnter() {
    this.iddata = this.navParams.get('iddata');
    console.log(this.iddata);
    this.getdata();
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditproductPage');
    //
  }
  dismiss() {;
    this.viewCtrl.dismiss();
  }

  
  getdata(){
    let loading = this.loadingCtrl.create({
      content: '<img src="assets/imgs/loading.gif"/> <br>  Loading Stories.. Please wait.'
    });
    loading.setSpinner("none");
    loading.present();    
    this.rs.getData('product/'+ this.iddata)
      .then(data => {
        this.product = data; 
        console.log(this.product); 
        
        this.form.controls['contentText'].setValue(this.product.Name);
        this.form.controls['contentTextDescription'].setValue(this.product.Desc);
        this.form.controls['price'].setValue(this.product.Price);
        this.form.controls['quantity'].setValue(this.product.Quantity);
        this.storyImage = this.product.image;
        


        setTimeout(() => {
          loading.dismiss();
        }, 0);
      });


 }


 postContent2() {
  let uid = "";
  this.user.getUserId().then((userName) => {
    uid = userName;
    let contentText: any = this.form.controls['contentText'].value;
    let contentTextDescription: any = this.form.controls['contentTextDescription'].value;
    let price: any = this.form.controls['price'].value;
    let quantity: any = this.form.controls['quantity'].value;
    if (undefined !== this.storyImage) {
      this.uploadImage(this.storyImage)
        .then((snapshot: any) => {
          snapshot.ref.getDownloadURL().then(downloadURL => {
            let uploadedImage: any = downloadURL;
            console.log(uploadedImage);
            this.rs.putData('product/update/'+this.iddata, {
              Name: contentText,
              Desc: contentTextDescription,
              image: uploadedImage,
              Price:price,
              Quantity:quantity
            }).then(data => {
              this.dismiss();
            });
          });
        });
    } else {
      this.rs.putData('product/update/'+this.iddata, {
        Name: contentText,
        Desc: contentTextDescription,
        Price:price,
        Quantity:quantity         
      }).then(data => {
        this.dismiss();
      });

    }

  });
}

  
  uploadImage(imageString): Promise < any > {
    let image: string = 'movie-' + new Date().getTime() + '.jpg',
      storageRef: any,
      parseUpload: any;

    return new Promise((resolve, reject) => {
      storageRef = firebase.storage().ref('posters/' + image);
      parseUpload = storageRef.putString(imageString, 'data_url');
      parseUpload.on('state_changed', (_snapshot) => {
          // console.log('snapshot progess ');
          // console.log(_snapshot);
        },
        (_err) => {
          reject(_err);
        },
        (success) => {
          resolve(parseUpload.snapshot);
        });
    });
  }


  selectImage() {
    this._IMG.selectImage()
      .then((data) => {
        this.storyImage = data;
      });
  }

}
