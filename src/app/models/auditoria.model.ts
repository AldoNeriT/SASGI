export class Auditoria {

    constructor(
        public nombreAuditoria: string,
        public nombre: string,
        public normas: Object,
        public fechaInicial: string,
        public fechaFinal: string,
        public plan: string,
        public grupoAuditor: Object,
        // public auditados: Object,
        public objetivos: string,
        public alcance: string,
        public contacto: string,
        public _id?: string,
        public pasos?: number,
        public progreso?: string,
        public valido?: boolean,
        public estado?: boolean
    ) { }
}
