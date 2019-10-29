export class Bitacora {

    constructor(
        public fecha: string,
        public seleccion: string,
        public correccion: string,
        public causa: string,
        public antecedentes: string,
        public correctiva: string,
        public planes: string,
        public fechaCumplimiento: string,
        public responsable: string,
        public fechaCierre: string,
        public _id?: string,
        public estado?: boolean
    ) { }
}