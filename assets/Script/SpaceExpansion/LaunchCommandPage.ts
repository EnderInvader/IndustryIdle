/////////////////// Space Expansion (Ender_Invader) ////////////////////
import {
    addCash,
    orderInterval,
    RES,
    resourcesBeingProduced,
    tryDeductResources,
    //wholesaleCenterMinimumResources,
} from "../CoreGame/Logic/Logic";
import { D, G, T } from "../General/GameData";
import { capitalize, formatHMS, formatPercent, ifTrue, keysOf, mapOf, nf, safeGet } from "../General/Helper";
import { t } from "../General/i18n";
import { serverNow } from "../General/ServerClock";
import { iconB, leftOrRight, progressBar, uiHeaderRoute } from "../UI/UIHelper";
import { hideAlert, showAlert, showToast } from "../UI/UISystem";

import { generateAsteroid, getAsteroidClass, getAsteroidSize, LaunchCommandActive } from "./SpaceExpansion";

export function LaunchCommandPage(): m.Comp {
    return {
        view: () => {
            const now = serverNow();
            const active = LaunchCommandActive();
            return m("div.modal", { class: leftOrRight() }, [
                uiHeaderRoute(t("LaunchCommand"), "/main"),
                m("div.scrollable", [
                    ifTrue(!active, () =>
                        m(".box", [
                            m(".title", t("LaunchCommandInactive")),
                        ]),
                    ),
                    ifTrue(active, () =>
                        m(".box", [
                            m(".title", t("RadarSats", {
                                amount: "" + D.radarSats,
                            })),
                            m(".title", t("TelescopeSats", {
                                amount: "" + D.telescopeSats,
                            })),
                            m(".title", t("AsteroidDetected", {
                                amount: "" + D.asteroidsSpace.length,
                            })),
                            D.asteroidsSpace.map((asteroid) => {
                                return [
                                    m(".hr"),
                                    m(
                                        ".box.text-desc.text-center",
                                        [
                                            iconB(getAsteroidSize(asteroid.totalAmount), 24, 10, {}, { class: "blue" }),
                                            m(".f1", [
                                                m(
                                                    "div",
                                                    t("AsteroidDetectedItem", {
                                                        class: getAsteroidClass(asteroid.totalAmount) as string,
                                                        res: RES[asteroid.resource].name(),
                                                    })
                                                ), // TODO: Asteroid Distance
                                            ]),
                                        ]
                                    ),
                                ];
                            }),
                        ]),
                    ),
                    ifTrue(false, () =>
                        m(".box", [
                            m(".title", t("AsteroidRedirecting", {
                                amount: "" + D.asteroidsOrbit.length,
                            })),
                            D.asteroidsOrbit.map((asteroid) => {
                                return [
                                    m(".hr"),
                                    m(
                                        ".box.text-desc.text-center",
                                        [
                                            iconB(getAsteroidSize(asteroid.totalAmount), 24, 10, {}, { class: "blue" }),
                                            m(".f1", [
                                                m(
                                                    "div",
                                                    t("AsteroidRedirectingItem", {
                                                        class: getAsteroidClass(asteroid.totalAmount) as string,
                                                        res: RES[asteroid.resource].name(),
                                                    })
                                                ), // TODO: Redirection
                                                progressBar(asteroid.leftDistance, asteroid.totalDistance),
                                            ]),
                                        ]
                                    ),
                                ];
                            }),
                        ]),
                    ),
                    ifTrue(active, () =>
                        m(".box", [
                            m(".title", t("AsteroidInOrbit", {
                                amount: "" + D.asteroidsOrbit.length,
                            })),
                            D.asteroidsOrbit.map((asteroid) => {
                                return [
                                    m(".hr"),
                                    m(
                                        ".box.text-desc.text-center",
                                        [
                                            iconB(getAsteroidSize(asteroid.totalAmount), 24, 10, {}, { class: "blue" }),
                                            m(".f1", [
                                                m(
                                                    "div",
                                                    t("AsteroidInOrbitItem", {
                                                        class: getAsteroidClass(asteroid.totalAmount) as string,
                                                        res: RES[asteroid.resource].name(),
                                                    })
                                                ), // TODO: Mining Sats
                                            ]),
                                        ]
                                    ),
                                ];
                            }),
                        ]),
                    ),

                    // TODO: REMOVE, DEBUG
                    ifTrue(active, () =>
                        m(".box", [
                            m(".title", "DEBUG"),
                            m(".action", [
                                m(
                                    ".red",
                                    {
                                        onclick: () => {
                                            D.asteroidsSpace = [];
                                            D.asteroidsOrbit = [];
                                        },
                                    },
                                    "CLEAR"
                                ),
                                m(
                                    ".blue",
                                    {
                                        onclick: () => {
                                            const asteroid = generateAsteroid();
                                            D.asteroidsSpace.unshift(asteroid);
                                        },
                                    },
                                    "ADD"
                                ),
                            ]),
                        ]),
                    ),
                ]),
            ]);
        },
    };
}
