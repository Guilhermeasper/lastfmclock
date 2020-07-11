import { SpotifyapiService } from './spotifyapi.service';
import { LastfmService } from './lastfm.service';
import { Component, OnInit } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

@Component({
    selector: "app-root",
    templateUrl: "app.component.html",
    styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
    public title: string;
    public artist: string = "";
    public user: string = "";
    public playcount = 0;
    public selectedIndex = 0;
    public dias = 0;
    public horas = 0;
    public minutos = 0;
    public segundos = 0;
    public busca = false;
    private key = "a5a97029436ae2465f6da09ead203ceb";
    public appPages = [
        {
            title: "Lastfm Artists Clock",
            url: "/home",
            icon: "mail",
        },
    ];
    public labels = [
        "Family",
        "Friends",
        "Notes",
        "Work",
        "Travel",
        "Reminders",
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        public lastfmService: LastfmService,
        public spotifyApiService: SpotifyapiService
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    ngOnInit() {
        this.title = "Lastfm Artists Clock";
        const path = window.location.pathname.split("folder/")[1];
        if (path !== undefined) {
            this.selectedIndex = this.appPages.findIndex(
                (page) => page.title.toLowerCase() === path.toLowerCase()
            );
        }
    }

    async calcular(){
        console.log(`${this.user} ${this.artist}`);
        let artistId: any;
        artistId = await this.spotifyApiService.artistSearch(this.artist);
        console.log(artistId);
        let albums = await this.spotifyApiService.artistAlbums(artistId);
        //console.log(JSON.parse(albums));
        //this.lastfmService.andamento.subscribe((result) => console.log(result) );
        // let result: any = await this.lastfmService.getTopArtist(this.user, this.artist, this.key);
        // this.playcount = result.playcount;
        // let time = result.time;
        // this.dias = Math.floor(time/(24*3600));
        // time = time % (24*3600);
        // this.horas = Math.floor(time/ 3600);
        // time = time % 3600;
        // this.minutos = Math.floor(time/60);
        // time = time % 60;
        // this.segundos = time;
        // this.busca = true;
    }
}
