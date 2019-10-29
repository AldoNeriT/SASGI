export class Informe {

    constructor(
        public auditoria: string,
        public proceso: string,
        public fecha: string,
        public oportunidadesMejora: any[],
        public comentarios: string,
        public conclusiones: string,
        public auditorLider: string,
        public director: string,
        public fechaAuditorias: string,
        public fechaEmision: string,
        public _id?: string,
        public estado?: boolean
    ) { }
}
