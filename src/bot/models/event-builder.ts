import { Event } from "./event.js";

const defaultEquipment = [
    'Scarponi da Trekking',
    'Abbigliamento adatto alle condizioni climatiche',
    'Bastoncini da Trekking',
    'Zaino da trekking',
    'Pranzo al sacco, snack leggeri e bevande'
];

export class EventBuilder {
    private step: number;
    private event: Event;

    constructor() {
        this.step = 1;
        this.event = {};
    }

    setTitle(title: string) {
        this.event.title = title;
        this.step += 1;
    }

    setDescription(description: string) {
        this.event.description = description;
        this.step += 1;
    }

    setPhotoId(photoId: string | null) {
        this.event.photoId = photoId;
        this.step += 1;
    }

    setDate(date: string) {
        this.event.date = date;
        this.step += 1;
    }

    setStartTime(startTime: string) {
        this.event.startTime = startTime;
        this.step += 1;
    }

    setMeetingPoint(meetingPoint: string) {
        this.event.meetingPoint = meetingPoint;
        this.step += 1;
    }

    setDifficultyLevel(difficultyLevel: string) {
        this.event.difficultyLevel = difficultyLevel;
        this.step += 1;
    }

    setDuration(duration: string) {
        this.event.duration = duration;
        this.step += 1;
    }

    setTotalDistance(totalDistance: string) {
        this.event.totalDistance = totalDistance;
        this.step += 1;
    }

    setEquipment(equipment: string) {
        if (equipment === '-') {
            this.event.equipment = [...defaultEquipment];
        } else {
            this.event.equipment = [...defaultEquipment, ...equipment.split(',')];
        }
        this.step += 1;
    }

    setItinerary(itinerary: string) {
        this.event.itinerary = itinerary;
        this.step += 1;
    }

    getFullTitle() {
        return `${this.event.title?.toUpperCase()} - ${this.event.date}`;
    }

    getPhotoId() {
        return this.event.photoId;
    }

    getStep() {
        return this.step;
    }

    formatEvent() {
        let script = `*${this.getFullTitle().replace(/[-_.!]/g, '\\$&')}*\n\n`
    
        if (this.event.description !== '-') {
            script += `_${this.event.description?.replace(/[-_.!]/g, '\\$&')}_\n\n`
        }
    
        script += `📆 Data: *${this.event.date?.replace(/[-_.!]/g, '\\$&')}*\n`
        script += `💨 Orario di Incontro e Partenza: *${this.event.startTime?.replace(/[-_.!]/g, '\\$&')}*\n\n`
    
        script += `📍 [Punto di Incontro](${this.event.meetingPoint})\n\n`
        script += `🔰 Livello di Difficoltà: *${this.event.difficultyLevel}*\n`

        if (this.event.difficultyLevel?.toLowerCase() === 'difficile') {
            script += "‼ *Questo percorso non è adatto ai principianti\\.*\n";
        }

        script += "\n"
    
        script += `⏳ Durata: *${this.event.duration}*\n`
        script += `🗺 Distanza totale: *${this.event.totalDistance}*\n\n`
    
        script += `🧥 Attrezzatura consigliata:\n\n`
    
        for (let equipment of this.event.equipment || []) {
            script += `• ${equipment}\n`
        }
        
        script += `\n`
    
        script += `🧗‍♂️ [Itinerario](${this.event.itinerary})\n\n`
    
        script += "__*Consigli e Avvertenze:*__\n\n"
        
        script += "❗ *Ricordo inoltre che non siamo guide alpine e per tanto ognuno è responsabile della propria incolumità\\!*\n\n"

        script += "‼ *È dovere dell'interessato/a valutare, secondo il suo livello di preparazione, se è in grado di affrontare il percorso o meno\\.*\n\n"
        
        script += "⚠️ __*Attenzione: Questa escursione è riservata esclusivamente a partecipanti maggiorenni\\.*__\n\n";

        return script;
    }
}