export class Planeacion {

    constructor(
        public fecha: string,
        public horario: string,
        public proceso: Object,
        public actividad: string,
        public criterio: string,
        public auditores: Object,
        public participantes: string,
        public contacto: string,
        public area: string,
        public auditoria: Object,
        public _id?: string,
        public enviar?: boolean,
        public estado?: boolean
    ) { }
}
