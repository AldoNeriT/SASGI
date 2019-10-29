export class DocumentoReferencia {

    constructor(
        public tabla: string,
        public informe: string,
        public revision: string,
        public resultado: string,
        public _id?: string,
        public estado?: boolean
    ) { }
}