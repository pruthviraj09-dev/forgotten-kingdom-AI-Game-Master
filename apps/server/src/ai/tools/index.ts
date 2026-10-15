import { attackEnemyTool } from "./attack-enemy.tool";
import { completeQuestTool } from "./complete-quest.tool";
import { createQuestTool } from "./create-quest.tool";
import { dropItemTool } from "./drop-item.tool";
import { getInventoryTool } from "./get-inventory.tool";
import { getLocationTool } from "./get-location.tool";
import { getNearbyEnemiesTool } from "./get-nearby-enemies.tool";
import { getNearbyLocationsTool } from "./get-nearby-locations.tool";
import { getPlayerTool } from "./get-player.tool";
import { getQuestsTool } from "./get_quests.tool";
import { movePlayerTool } from "./move-player.tool";
import { pickupItemTool } from "./pickup-item.tool";
import { startCombatTool } from "./start-combat.tool";

export const gameTools = {
    get_player: getPlayerTool,
    move_player: movePlayerTool,
    get_inventory: getInventoryTool,
    get_location: getLocationTool,
    get_nearby_locations: getNearbyLocationsTool,
    pickup_itme: pickupItemTool,
    drop_item: dropItemTool,
    get_quests: getQuestsTool,
    create_quest: createQuestTool,
    complete_quest: completeQuestTool,
    get_nearby_enemies: getNearbyEnemiesTool,
    start_combat: startCombatTool,
    attack_enemy: attackEnemyTool
}