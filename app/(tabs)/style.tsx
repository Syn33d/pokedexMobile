import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        padding: 10,
    },

    text: {
        color: 'white',
    },

    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
    },

    primaryButton: {
        backgroundColor: '#646cff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    card: {
        padding: 32,
    },
    readTheDocs: {
        color: '#888',
    },
    table: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 8,
        textAlign: 'center',
    },
    scrollButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#646cff',
        color: '#fff',
        borderRadius: 999,
        padding: 10,
        zIndex: 999,
    },
    scrollButtonHover: {
        backgroundColor: '#4040a1',
    },

    centered: {
        justifyContent: 'center',
    },

    centeredTypes: {
        justifyContent: 'center',
    },
    centeredStats: {
        justifyContent: 'center',
    },
    centeredResistances: {
        justifyContent: 'center',
    },
    centeredFamily: {
        justifyContent: 'center',
    },

    formGroup: {
        marginBottom: 20,
    },
    formControl: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    typeImage: {
        marginBottom: 10, // Ajoute une marge en bas de 10 points
    },
});
