/////////////////// Space Expansion (Ender_Invader) ////////////////////
import {
    D,
    G,
    GameData,
    hasDLC,
    ORIGINAL_GAMEDATA,
    PersistedData,
    saveDataOverride,
    SwissBoosts,
    T,
} from "../General/GameData";
import {
    assert,
    firstKeyOf,
    forEach,
    getOrSet,
    hasProperty,
    hasValue,
    keysOf,
    MINUTE,
    permute,
    safeAdd,
    safeGet,
    sizeOf,
} from "../General/Helper";
import { t } from "../General/i18n";
import { serverNow } from "../General/ServerClock";
import { hideAlert, showAlert, showToast } from "../UI/UISystem";
import { ResourceNumberMap, ResourceSet } from "../CoreGame/Buildings/BuildingDefinitions";
import { Resources } from "../CoreGame/ResourceDefinitions";
import { resourcesCanBeProduced } from "../CoreGame/Logic/Logic";

export function LaunchCommandActive() {
    return D.unlockedBuildings["AdvancedSatelliteFactory"]
}

export interface IAsteroid {
    radarDetection: boolean;
    visualDetection: boolean;
    resource: keyof Resources;
    totalAmount: number;
    leftAmount: number;
    time: number;
    validFor: number;
    totalDistance: number;
    leftDistance: number;
    redirectionSats: number;
    miningSats: number;
}

export type AsteroidSize = "large" | "medium" | "small";
export function getAsteroidSize(amount: number): AsteroidSize {
    if (amount < 3333) {
        return "small"
    }
    else if (amount < 6666) {
        return "medium"
    }
    else return "large"
}
export function getAsteroidClass(amount: number): String {
    const asteroidSize: AsteroidSize = getAsteroidSize(amount);
    if (asteroidSize === "large") return "Class C";
    else if (asteroidSize === "medium") return "Class B";
    else if (asteroidSize === "small") return "Class A";
    else return "Unknown Class";
}
export function generateAsteroid(): IAsteroid {
    const rawResources: ResourceSet = {
        Fe: true,
        Al: true,
        Si: true,
        Cu: true,
        Cr: true,
        Ti: true,
        U: true,
        Li: true,
    };
    let availableResources = keysOf(rawResources);

    const amount = cc.randi(1000, 10000)
    const distance = cc.randi(100, 10000);

    const asteroid: IAsteroid = {
        radarDetection: false,
        visualDetection: false,
        resource: availableResources.randOne(),
        totalAmount: amount,
        leftAmount: amount,
        time: serverNow(),
        validFor: cc.randf(5 * MINUTE, 10 * MINUTE),
        totalDistance: distance,
        leftDistance: distance,
        redirectionSats: 0,
        miningSats: 0,
    };
    return asteroid;
}

const ASTEROID_INTERVAL = 4 * MINUTE;
export function asteroidInterval() {
    //return D.swissBoosts.wholesaleUpgrade1 ? ORDER_INTERVAL / 2 : ORDER_INTERVAL;
    return ASTEROID_INTERVAL;
}
export function tickAsteroids(now: number) {
    // Asteroid Generation
    D.asteroidsSpace = D.asteroidsSpace.filter((o) => o.time + o.validFor >= now);
    if (T.lastAsteroidAt === 0) {
        T.lastAsteroidAt = now;
    }
    if (now - T.lastAsteroidAt >= asteroidInterval() && LaunchCommandActive()) {
        T.lastAsteroidAt = now;
        const asteroid = generateAsteroid();
        D.asteroidsSpace.unshift(asteroid);

        //G.audio.playEffect(G.audio.powerup);
        //showToast(t("NewOrder", { from: order.name })); // TODO: Language Def
    }

    // Asteroid Detection
    D.asteroidsSpace.forEach(asteroid => {
        if (asteroid.leftDistance <= G.launchCommand.resources.RadarSat) {
            asteroid.radarDetection = true;
        }
        else {
            asteroid.radarDetection = false;
        }
    })
    D.asteroidsSpace.forEach(asteroid => {
        if (asteroid.radarDetection && asteroid.leftDistance <= G.launchCommand.resources.TeleSat) {
            asteroid.visualDetection = true;
        }
    })
}

export function tickSatellites() {
    if (G.launchCommand.resources.RadarSat > 1) G.launchCommand.resources.RadarSat *= 0.8;
    else G.launchCommand.resources.RadarSat = 0;
    
    if (G.launchCommand.resources.TeleSat > 1) G.launchCommand.resources.TeleSat *= 0.8;
    else G.launchCommand.resources.TeleSat = 0;
    
    if (G.launchCommand.resources.AstroDir > 1) G.launchCommand.resources.AstroDir *= 0.8;
    else G.launchCommand.resources.AstroDir = 0;
    
    if (G.launchCommand.resources.AstroMiner > 1) G.launchCommand.resources.AstroMiner *= 0.8;
    else G.launchCommand.resources.AstroMiner = 0;
}