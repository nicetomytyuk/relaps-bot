import { Event } from "./event.js";

const defaultEquipment = [
    'Scarponi da Trekking',
    'Abbigliamento adatto alle condizioni climatiche',
    'Bastoncini da Trekking',
    'Zaino da trekking',
    'Pranzo al sacco, snack leggeri e bevande'
];

export class EventBuilder {
    private event: Event;

    constructor() {
        this.event = {};
    }

    setTitle(title: string) {
        this.event.title = title;
    }

    setDescription(description: string | null) {
        this.event.description = description;
    }

    setPhotoId(photoId: string | null) {
        this.event.photoId = photoId;
    }

    setDate(date: string) {
        this.event.date = date;
    }

    setStartTime(startTime: string) {
        this.event.startTime = startTime;
    }

    setMeetingPoint(meetingPoint: string) {
        this.event.meetingPointUrl = meetingPoint;
    }

    setDifficulty(difficultyLevel: string) {
        this.event.difficultyLevel = difficultyLevel;
    }

    setDuration(duration: string) {
        this.event.duration = duration;
    }

    setDistance(totalDistance: string) {
        this.event.totalDistance = totalDistance;
    }

    setEquipment(equipment: string | null) {
        if (!equipment) {
            this.event.equipment = [...defaultEquipment];
        } else {
            this.event.equipment = [...defaultEquipment, ...equipment.split(',')];
        }
    }

    setItinerary(itinerary: string) {
        this.event.itineraryUrl = itinerary;
    }
    
    setInvite(invitation: string | null) {
        this.event.invitation = invitation;
    }

    getInvite() {
        return this.event.invitation;
    }

    getFullTitle() {
        return `${this.event.title?.toUpperCase()} - ${this.event.date}`;
    }

    getPhotoId() {
        return this.event.photoId;
    }

    getEvent() {
        const title = this.getFullTitle().replace(/[-_.!]/g, '\\$&');
        let script = `*${title}*\n\n`
    
        const description = this.event.description?.replace(/[-_.!]/g, '\\$&');
        if (description !== undefined && description !== null) {
            script += `_${description}_\n\n`
        }
    
        const date = this.event.date?.replace(/[-_.!]/g, '\\$&');
        script += `📆 Data: *${date}*\n`

        const startTime = this.event.startTime?.replace(/[-_.!]/g, '\\$&');
        script += `💨 Orario di Incontro e Partenza: *${startTime}*\n\n`
    
        script += `📍 [Punto di Incontro](${this.event.meetingPointUrl})\n\n`

        const difficultyLevel = this.event.difficultyLevel?.replace(/[-_.!]/g, '\\$&');
        script += `🔰 Livello di Difficoltà: *${difficultyLevel}*\n`

        if (difficultyLevel?.toLowerCase() === 'difficile') {
            script += "❗️ *Questo percorso non è adatto ai principianti\\* ❗️\n";
        }

        script += "\n"
    
        const duration = this.event.duration?.replace(/[-_.!]/g, '\\$&');
        script += `⏳ Durata: *${duration}*\n`

        const totalDistance = this.event.totalDistance?.replace(/[-_.!]/g, '\\$&');
        script += `🗺 Distanza totale: *${totalDistance}*\n\n`
    
        script += `🧥 Attrezzatura consigliata:\n\n`
    
        for (let equipment of this.event.equipment || []) {
            script += `• ${equipment.trim()}\n`
        }
        
        script += `\n`
    
        script += `🧗‍♂️ [Itinerario](${this.event.itineraryUrl})\n\n`
    
        script += "__*Consigli e Avvertenze:*__\n\n"
        
        script += "❗ *Ricordo inoltre che non siamo guide alpine e per tanto ognuno è responsabile della propria incolumità\\!*\n\n"

        script += "‼️ *È dovere dell'interessato/a valutare, secondo il suo livello di preparazione, se è in grado di affrontare il percorso o meno\\.*\n\n"
        
        script += "⚠️ __*Attenzione: Questa escursione è riservata esclusivamente a partecipanti maggiorenni\\.*__\n\n";

        return script;
    }
}