export class Mensagem {
	public msg_usuario: string;
	public msg_watson: string;
	public intencao: string;
	public confianca: number;

	constructor(msg_usuario: string, msg_watson?: string, intencao?: string, confianca?: number) {
		this.msg_usuario = msg_usuario;
		this.msg_watson = msg_watson;
		this.intencao = intencao;
		this.confianca = confianca;
	}
}