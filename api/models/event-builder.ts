import { Event } from "./event";

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

    setPhotoId(photoId: string) {
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

    setEquipment(equipment: string[]) {
        this.event.equipment = equipment;
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
        const defaultEquipment = [
            'Abbigliamento adatto alle condizioni climatiche (possibilmente impermeabile)',
            '*Scarponi da Trekking*',
            'Bastoncini da Trekking',
            'Zaino da trekking',
            'Pranzo al sacco, snack leggeri e bevande'
        ];
    
        let script = `*${this.getFullTitle()}*\n\n`
    
        if (this.event.description !== '-') {
            script += `${this.event.description}\n\n`
        }
    
        script += `📆 Data: *${this.event.date}*\n`
        script += `💨 Orario di Incontro e Partenza: *${this.event.startTime}*\n\n`
    
        script += `📍 [Punto di Incontro](${this.event.meetingPoint})\n`
        script += `🔰 Livello di Difficoltà: *${this.event.difficultyLevel}*\n\n`
    
        script += `⏳ Durata: *${this.event.duration}*\n`
        script += `🗺 Distanza totale: *${this.event.totalDistance}*\n\n`
    
        script += `🧥 Attrezzatura consigliata:\n\n`
    
        if (this.event.equipment?.length === 1 && this.event.equipment[0] === '-') {
            for (let equipment of defaultEquipment) {
                script += `- ${equipment}\n`
            }
        } else {
            for (let equipment of this.event.equipment || []) {
                script += `- ${equipment}\n`
            }
        }
        script += `\n`
    
        script += `🧗‍♂️ [Itinerario](${this.event.itinerary})\n\n`
    
        script += "*Considerazioni finali:*\n\n"
        
        script += "‼ *Ricordo inoltre che non siamo guide alpine e per tanto ognuno è responsabile della propria incolumità!*\n\n"
        script += "⚠️ *Attenzione: Questa escursione è riservata esclusivamente a partecipanti maggiorenni.*\n\n";

        return script;
    }
}