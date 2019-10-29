export class ListaVerificacion {

    constructor(
        public auditor: string,
        public planeacion: string,
        public puntoNorma: string,
        public pregunta: string,
        public documento: string,
        public evidencia: string,
        public hallazgos: string,
        public entrevistado?: string,
        public fecha?: string,
        public _id?: string,
        public estado?: boolean,
        public valido?: boolean,
        public enviar?: boolean
    ) { }
}