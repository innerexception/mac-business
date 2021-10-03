export enum UIReducerActions { 
    LOGOUT,
    LOGIN_FAILED,
    HIDE_MODAL,
    MATCH_UPDATED,
    SHOW_MODAL,
    LOGIN_SUCCESS,
    UPDATE_NAME,
    LEAVE_MATCH,
    JOIN_EXISTING,
    UPDATE_PLAYER
}

export const FONT_DEFAULT = {
    fontFamily: 'Body', 
    fontSize: '14px',
    color:'black',
}

export enum CloudFunctions {
    onTryPlayerJoin='onTryPlayerJoin',
    onPlayerLeave='onPlayerLeave',
    onSubmitPlayerBuild='onSubmitPlayerBuild',
    onSubmitPlayerWager='onSubmitPlayerWager',
    onSubmitPlayerVote='onSubmitPlayerVote',
    onSubmitNewPlayer='onSubmitNewPlayer'
}

export enum Edict {
    SoulDeficit='Soul Deficit'
}

export const Edicts:Record<Edict, EdictData> = {
    [Edict.SoulDeficit]: {
        name: Edict.SoulDeficit,
        description: "Soul values may go negative. Our extra dimensional 'friends' are more attracted to such people."
    }
}

export enum Corporation {
    Wernstern,
    Rontheon,
    HellBank,
    McKillsie,
    Elysium,
    PardonPharma
}

export const Corpos:Array<Corporation> = [Corporation.Elysium,Corporation.HellBank, Corporation.McKillsie, Corporation.PardonPharma, Corporation.Rontheon, Corporation.Wernstern]

export enum Ability {
    Tweet='Cursed Tweet',
    Mouthpiece='Mouthpiece of Chaos',
    OnlyFams='OnlyFams',
    TrollArmy='Troll Army',
    BrandedContent='Branded Content',
    Drone='Drone Strike',
    BothSides='Both sides',
    WarForTerror='War for Terror',
    InformationWarfare='Information Warfare',
    TeleportationFields='Teleportation Fields',
    CurrencyManipulation='Currency Manipulation',
    ARMLoans='ARM Loans',
    RepoArmy='Repo Army',
    CapitalGains='Capital Gains',
    LineGoUp='Line Go Up',
    MammonDevice='Mammon Device',
    NGOFunding='NGO Funding',
    GrowthPlan='Growth Plan',
    AusterityMeasures='Austerity Measures',
    MercenaryArmy='Mercenary Army',
    OxyCalm='OxyCalm',
    PowerThirst='PowerThirst',
    InfinitePatents='Infinite Patents',
    DickPill='DickPill',
    OrganDRM='Organ DRM',
    LicensingGuild='Licensing Guild'
}

export const Corporations:Record<Corporation, CorpoData> = {
    [Corporation.Elysium]: {
        color:'0x0000ff',
        description: "Leading innovations in extra dimensional health therapies. Join tomorrow's eternity today!",
        name: 'Elysium Medical Group',
        morale: 10,
        capital: 0,
        soul: 10,
        left:'-12%',
        logo: `
        ███████╗███╗   ███╗ ██████╗ 
        ██╔════╝████╗ ████║██╔════╝ 
        █████╗  ██╔████╔██║██║  ███╗
        ██╔══╝  ██║╚██╔╝██║██║   ██║
        ███████╗██║ ╚═╝ ██║╚██████╔╝
        ╚══════╝╚═╝     ╚═╝ ╚═════╝ 
        `
    },
    [Corporation.HellBank]: {
        color:'0xff0000',
        name: "Hell's Fargo Financial",
        description: 'Got cash? Not for long!',
        morale: 10,
        capital: -5,
        soul: 10,
        left:'-10%',
        logo: `
        $$\   $$\ $$$$$$$$\ $$$$$$$\  
        $$ |  $$ |$$  _____|$$  __$$\ 
        $$ |  $$ |$$ |      $$ |  $$ |
        $$$$$$$$ |$$$$$\    $$$$$$$\ |
        $$  __$$ |$$  __|   $$  __$$\ 
        $$ |  $$ |$$ |      $$ |  $$ |
        $$ |  $$ |$$ |      $$$$$$$  |
        \__|  \__|\__|      \_______/      
        `
    },
    [Corporation.McKillsie]: {
        color:'0xcccccc',
        description: 'McKillsie Consulting has a proven track record of turning successful firms into decomposing yet still living piles of organic matter.',
        name: 'McKillsie Consulting',
        morale: 10,
        capital: 0,
        soul: 10,
        left:'-10%',
        logo: `
        :::   :::                      :::    :::             
      :+:+: :+:+:                     :+:   :+:               
    +:+ +:+:+ +:+                    +:+  +:+                 
   +#+  +:+  +#+                    +#++:++                   
  +#+       +#+                    +#+  +#+                   
 #+#       #+#        #+#         #+#   #+#           #+#     
###       ###        ###         ###    ###          ###      
        `
    },
    [Corporation.PardonPharma]: {
        color:'0xff00ff',
        name: 'PardonPharma',
        description: 'Like if El Chapo had lobbyists.',
        morale: 10,
        capital: 0,
        soul: 20,
        left:'-10%',
        logo: `
 ____   ____ ____  ___    ___  ____  
 |    \ /    |    \|   \  /   \|    \ 
 |  o  )  o  |  D  )    \|     |  _  |
 |   _/|     |    /|  D  |  O  |  |  |
 |  |  |  _  |    \|     |     |  |  |
 |  |  |  |  |  .  \     |     |  |  |
 |__|  |__|__|__|\_|_____|\___/|__|__|
        `
    },
    [Corporation.Rontheon]: {
        color:'0xff0000',
        name: 'Rontheon Defense',
        description: 'A proven track record of turning successful countries and individuals into smoking heaps of gory ash.',
        morale: 10,
        capital: 0,
        soul: 10,
        left:'-25%',
        logo: `                                                     
    //   ) )                                                            
    //___/ /   ___       __   __  ___ / __      ___      ___       __    
   / ___ (   //   ) ) //   ) ) / /   //   ) ) //___) ) //   ) ) //   ) ) 
  //   | |  //   / / //   / / / /   //   / / //       //   / / //   / /  
 //    | | ((___/ / //   / / / /   //   / / ((____   ((___/ / //   / /   
        `
    },
    [Corporation.Wernstern]: {
        color:'0x00ff00',
        name: 'Wernstern Media',
        description: 'If you read it, we wrote it.',
        morale: 5,
        capital: 0,
        soul: 10,
        left:'-40%',
        width:'340px',
        logo: `
 _|          _|                                            _|                                    
 _|          _|    _|_|    _|  _|_|  _|_|_|      _|_|_|  _|_|_|_|    _|_|    _|  _|_|  _|_|_|    
 _|    _|    _|  _|_|_|_|  _|_|      _|    _|  _|_|        _|      _|_|_|_|  _|_|      _|    _|  
   _|  _|  _|    _|        _|        _|    _|      _|_|    _|      _|        _|        _|    _|  
     _|  _|        _|_|_|  _|        _|    _|  _|_|_|        _|_|    _|_|_|  _|        _|    _|  
        `
    },
}

export enum Modal {
    HELP,
    MENU,
    SCORES,
    INFO,
    EDIT_BUILD,
    CHOOSE_EMPLOYMENT
}

export const Avatars = [
    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','x','y','z',
    'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','X','Y','Z',
]