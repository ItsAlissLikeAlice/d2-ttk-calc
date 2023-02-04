import range from 'lodash/range';

export type ShotCombo = {
	bodyshots: number, 
	headshots: number,
	totalShots: number
};

export type ShotComboWithDamage = ShotCombo & {damage: number};

export type ShotComboWithTtk = ShotComboWithDamage & {ttk: number};

function generateShotCombos(maxShots: number): ShotCombo[] {
	if (maxShots > 0) {
		let combos: ShotCombo[] = [];
		range(1, maxShots + 1).forEach((nShots) => {
			const nShotsCombos: ShotCombo[] = range(0, nShots + 1).map((bodyshots) => {
				return {
					bodyshots, 
					headshots: nShots - bodyshots,
					totalShots: nShots
				};
			})
			combos = combos.concat(nShotsCombos);
		});
		return combos;
	}
	return [];
}

function calculateDamage(shotCombo: ShotCombo, bodyshotDamage: number, headshotDamage: number): number {
	return shotCombo.bodyshots * bodyshotDamage + shotCombo.headshots * headshotDamage;
}

function shouldDisregardCombo(shotCombo: ShotComboWithDamage, bodyshotDamage: number, headshotDamage: number, enemyHp: number): boolean {
	if (shotCombo.damage < enemyHp)
		return true;
	if (shotCombo.bodyshots === 0) {
		return shotCombo.damage >= enemyHp + headshotDamage;
	} else {
		return shotCombo.damage >= enemyHp + bodyshotDamage;
	}
}

function calculateTtk(totalShots: number, rpm: number): number {
	const secondsPerShot = 60 / rpm;
	return secondsPerShot * (totalShots - 1);
}

export default function calculateAllTtks(bodyshotDamage: number, headshotDamage: number, rpm: number, enemyHp: number): ShotComboWithTtk[] {
	const maxShots: number = Math.ceil(enemyHp / bodyshotDamage);
	const shotCombos = generateShotCombos(maxShots);
	return shotCombos.map(combo => {
		return {
			...combo,
			damage: calculateDamage(combo, bodyshotDamage, headshotDamage),
			ttk: calculateTtk(combo.totalShots, rpm)
		};
	}).filter(shotComboWithTtk => {
		return !shouldDisregardCombo(shotComboWithTtk, bodyshotDamage, headshotDamage, enemyHp);
	});
}