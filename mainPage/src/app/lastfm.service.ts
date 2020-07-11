import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class LastfmService {
    public requestOptions: RequestInit;
    public andamento = new BehaviorSubject(0);
    constructor() {
        this.requestOptions = {
            method: "GET",
            redirect: "follow",
        };
    }

    async getTopArtist(user: string, artist: string, key: string) {
        let alreadyFinded = new Map();
        let time = 0;
        let userPlayCount = await this.fetchArtistInfo(user, key, artist);
        if(userPlayCount == 0){
            return {time: 0, playcount: 0};
        }
        let firstFetch: any = await this.fetchRecentTracks(user, key, 1, 1);
        console.log(firstFetch);
        let numberOfTracks = firstFetch.recenttracks["@attr"].total;
        let numberOfPages = Math.ceil(numberOfTracks / 1000);
        let allPagesArray = [];
        for (let index = 1; index <= numberOfPages; index++) {
            this.andamento.next((index/numberOfPages)/2);
            let secondFetch: any = await this.fetchRecentTracks(
                user,
                key,
                index,
                1000
            );
            let auxArray = secondFetch.recenttracks.track;
            allPagesArray = allPagesArray.concat(auxArray);
        }
        this.andamento.next(0.5);
        console.log(allPagesArray.length);
        for (let index = 0; index < allPagesArray.length; index++) {
            this.andamento.next(0.5 + ((index/(allPagesArray.length-1))/2));
            const element = allPagesArray[index];
            let elArtist = element.artist["#text"];
            let elTrack = element.name.replace(/\(.*$|\[.*$|\-.*$/g, "").trim();
            if (elArtist.toLowerCase() == artist.toLowerCase()) {
                if (!alreadyFinded.get(elTrack)) {
                    let thirdFetch: any = await this.fetchTrackInfo(
                        elTrack,
                        elArtist,
                        key
                    );
                    alreadyFinded.set(elTrack, thirdFetch);
                    time += thirdFetch;
                }else{
                    time += alreadyFinded.get(elTrack);
                }
            }
        }
        console.log(alreadyFinded);
        return {time: time, playcount: userPlayCount};;
    }

    fetchRecentTracks(user: string, key: string, index: number, limit: number) {
        return new Promise((resolve, reject) => {
            fetch(
                `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${key}&format=json&page=${index}&limit=${limit}`,
                this.requestOptions
            )
                .then((response) => response.text())
                .then((result) => {
                    let fullPageJsonResult = JSON.parse(result);
                    resolve(fullPageJsonResult);
                })
                .catch((error) => reject(error));
        });
    }

    fetchArtistInfo(user: string, key: string, artist: string) {
        return new Promise((resolve, reject) => {
            fetch(
                `https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${artist}&user=${user}&api_key=${key}&format=json`,
                this.requestOptions
            )
                .then((response) => response.text())
                .then((result) => {
                    let playcount = JSON.parse(result).artist.stats.userplaycount;
                    resolve(playcount);
                })
                .catch((error) => reject(error));
        });
    }

    fetchTrackInfo(track: string, artist: string, key: string) {
        return new Promise((resolve, reject) => {
            fetch(
                `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&track=${track}&artist=${artist}&api_key=${key}&format=json&autocorrect=1`,
                this.requestOptions
            )
                .then((response) => response.text())
                .then((result: any) => {
                    try {
                        let trackJsonResult = JSON.parse(result);
                        let duration = trackJsonResult.track.duration / 1000;
                        resolve(duration);
                    } catch (error) {
                        console.log(error);
                        resolve(0);
                    }
                })
                .catch((error) => reject(error));
        });
    }
}
