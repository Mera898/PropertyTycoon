import Phaser from "phaser";
import {PlayerNameStyle, BankCashStyle} from "../../styles";
import {TokenSprites, TokenNames, Hud} from "../../constants";
import RoundRectangle from "phaser3-rex-plugins/plugins/roundrectangle";

/**
 * This class represents the Banks HUD object
 * in the HUD layer. It shows a bank icon, name
 * and cash value that will show cash loss/gain
 * temporarily before updating the cash displayed
 * back to infinity.
 * 
 * @extends Phaser.GameObjects.Container
 * @memberof Hud
 * 
 * @property {Hud} hud The hud layer this belongs to.
 * @property {Bank} bank The internal bank object for the game.
 */
class BankHud extends Phaser.GameObjects.Container {
	/**
	 * Creates a hud background, graphic, name text and 
	 * cash text for the hud layer to represent the bank.
	 * 
	 * @param {Hud} hud The parent hud object.
	 * @param {Bank} bank The game bank instance.
	 */
	constructor(hud, bank) {
		super(hud.scene);

		this.hud = hud;
		this.bank = bank;

		let background = new RoundRectangle(hud.scene, 0, 0, 300, 200, 10, 0x000000, 0.75);
		background.setOrigin(0);
		let graphic = new Phaser.GameObjects.Sprite(this.scene, 150, 60, "tokens", TokenSprites.BANK);
		let nameText = new Phaser.GameObjects.Text(this.scene, 10, 120, TokenNames.BANK, PlayerNameStyle);
		this.cashText = new Phaser.GameObjects.Text(this.scene, 13, 155, Hud.BANK_DEFAULT_TEXT, BankCashStyle);
		nameText.setStroke(0x000000, 3);
		
		this.add([background, graphic, nameText, this.cashText]);

		this.bank.on("deposit", this._cashGained.bind(this));
		this.bank.on("withdraw", this._cashLost.bind(this));
	}

	/**
	 * Sets cash displayed to cash value passed in.
	 * 
	 * A timeout will be set to call {@link reset}() after
	 * {@link Hud#CASH_UPDATE_TIMEOUT} milliseconds.
	 * 
	 * @private
	 * @param {integer} cash Cash value gained.
	 */
	_cashGained(cash) {
		let string = `Cash +£${cash}`;
		
		this.cashText.setStyle({color: Hud.POSITIVE_COLOR });
		this.cashText.setText(string);

		setTimeout(this._reset.bind(this), Hud.CASH_UPDATE_TIMEOUT);
	}

	/**
	 * Sets cash displayed to cash value passed in.
	 * 
	 * A timeout will be set to call {@link reset}() after
	 * {@link Hud#CASH_UPDATE_TIMEOUT} milliseconds.
	 * 
	 * @private
	 * @param {integer} cash Cash value lost.
	 */
	_cashLost(cash) {
		let string = `Cash -£${cash}`;
		
		this.cashText.setStyle({color: Hud.NEGATIVE_COLOR});
		this.cashText.setText(string);

		setTimeout(this._reset.bind(this), Hud.CASH_UPDATE_TIMEOUT);
	}

	/**
	 * Resets cash value displayed back to infinity.
	 * 
	 * @private
	 */
	_reset() {
		this.cashText.setStyle({color: Hud.TEXT_COLOR});
		this.cashText.setText(Hud.BANK_DEFAULT_TEXT);
	}
}

export default BankHud;