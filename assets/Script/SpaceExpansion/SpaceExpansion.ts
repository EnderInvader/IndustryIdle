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

    const asteroid: IAsteroid = {
        resource: availableResources.randOne(),
        totalAmount: cc.randi(1000, 10000),
        leftAmount: 0,
        time: serverNow(),
        validFor: cc.randf(5 * MINUTE, 10 * MINUTE),
        totalDistance: cc.randi(1000, 10000),
        leftDistance: 0,
        redirectionSats: 0,
        miningSats: 0,
    };
    return asteroid;
}

export function tickAsteroidSpace(now: number) {
    D.asteroidsSpace = D.asteroidsSpace.filter((o) => o.time + o.validFor >= now);
    /* if (T.lastOrderAt === 0) {
        T.lastOrderAt = now;
    } */
    /* if (now - T.lastOrderAt >= orderInterval() && wholesaleUnlocked()) {
        //T.lastOrderAt = now;
        const order = generateOrder();
        D.orders.unshift(order);
        G.audio.playEffect(G.audio.powerup);
        showToast(t("NewOrder", { from: order.name })); // TODO: Language Def
    } */
}