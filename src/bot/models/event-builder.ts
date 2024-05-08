import { Event } from "./event.js";

export const defaultEquipment = [
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
            this.event.equipment = [
                ...defaultEquipment,
                ...equipment.split(',')
                    .map((item) => item.trim())
                    .map(this.capitalize)
            ];
        }
    }

    setItinerary(itinerary: string) {
        this.event.itineraryUrl = itinerary;
    }
    
    setInvite(invitation: string | null) {
        this.event.invitation = invitation;
    }

    setHeight(height: string | null) {
        this.event.height = height;
    }

    getInvite() {
        return this.event.invitation;
    }

    getFullTitle() {
        return `${this.event.title?.toUpperCase()} - ${this.event.date?.toUpperCase()}`;
    }

    getPhotoId() {
        return this.event.photoId;
    }

    private capitalize(word: string): string {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    private safeText(text: string | undefined | null): string | null {
        return text?.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&') ?? null;
    }

    getEvent() {
        const title = this.safeText(this.getFullTitle());
        const description = this.safeText(this.event.description);
        const date = this.safeText(this.event.date);
        const startTime = this.safeText(this.event.startTime);
        const difficultyLevel = this.safeText(this.event.difficultyLevel);
        const duration = this.safeText(this.event.duration);
        const distance = this.safeText(this.event.totalDistance);
        const height = this.safeText(this.event.height);

        let script = "__*ORGANIZZATO DA RELAPS HIKING*__\n\n"
        script += `*${title}*\n\n`

        if (description !== undefined && description !== null) {
            script += `_${description}_\n\n`
        }
    
        script += `📆 Data: *${date}*\n`

        script += `💨 Orario di Incontro e Partenza: *${startTime}*\n\n`
    
        script += `📍 [Punto di Incontro](${this.event.meetingPointUrl})\n\n`

        script += `🔰 Livello di Difficoltà: *${difficultyLevel}*\n`
        if (difficultyLevel?.toLowerCase().includes('difficile')) {
            script += "❗ *Questo percorso non è adatto ai principianti* ❗\n";
        }

        script += "\n"
    
        script += `⏳ Durata: *${duration}*\n`
        script += `🗺 Distanza totale: *${distance}*\n`
        if (height) {
            script += `🏔️ Dislivello positivo: *${height}*\n`
        }
        script += "\n"
    
        script += `🧥 Attrezzatura consigliata:\n\n`
        for (let equipment of this.event.equipment || []) {
            script += `• ${this.safeText(equipment.trim())}\n`
        }
        
        script += `\n`
    
        script += `🧗‍♂️ [Itinerario](${this.event.itineraryUrl})\n\n`
    
        script += "__*Consigli e Avvertenze:*__\n\n"
        
        script += "❗ *Ricordo inoltre che non siamo guide alpine e per tanto ognuno è responsabile della propria incolumità\\!*\n\n"

        script += "‼️ *È dovere dell'interessato/a valutare, secondo il suo livello di preparazione, se è in grado di affrontare il percorso o meno\\.*\n\n"
        
        script += "⚠️ __*Attenzione: Questa escursione è riservata esclusivamente a partecipanti maggiorenni\\.*__\n\n";

        script += "✅ Questa è un'attivita organizzata ufficialmente da Relaps Hiking\\!"

        return script;
    }
}