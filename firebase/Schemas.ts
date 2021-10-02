export const Schemas = {
    Collections: {
        Tournaments: {
            collectionName: 'mb-tourneys',
            fields: {
                id: 'id',
                brackets: 'brackets',
                isStarted: 'isStarted'
            }
        },
        User: {
            collectionName: 'mb-users',
            fields: {
                id:'id',
                name:'name',
                streak: 'streak',
                votes: 'votes'
            }
        },
        Edicts: {
            collectionName: 'mb-edicts',
            fields: {
                id:'id',
                data: 'data'
            }
        }
    }
}