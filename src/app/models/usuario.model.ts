
export class Usuario {

    constructor(
        public numero_Empleado: string,
        public nombre_Usuario: string,
        public nombre: string,
        public primer_Apellido: string,
        public email: string,
        public telefono: string,
        public puesto: string,
        public contraseña: string,
        public tipo_Usuario: string,
        public segundo_Apellido?: string,
        public _id?: string,
        public estado?: boolean
    ) { }
}
