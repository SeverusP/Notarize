// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
// Counters.sol non è presente nell'ultima versione (alternativa: variabile uint incrementale)
import "@openzeppelin/contracts/utils/Counters.sol";
// AccessControlEnumerable.sol non è presente nell'ultima versione (importa già funzioni da AbstractControl)
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract Notarize is Ownable, AccessControlEnumerable {
    // direttiva-> tutte le variabili di tipo Counters.Counter potranno usare le funzioni
    using Counters for Counters.Counter;

    // Inizializzo una costante calcolando l'hash da stringa
    // Rappresenta un ruolo al quale assegnare specifiche funzionalità
    bytes32 public constant HASH_WRITER = keccak256("HASH_WRITER");
    
    // Inizializzo un contatore
    Counters.Counter private _documentsCounter;

    // Creo un oggetto che rappresenta un documento con due proprietà
    struct Doc {
        string documentUrl; // dove è memorizzato
        bytes32 documentHash; // hash
    }

    // Mappatura per memorizzare i documenti (associo un id che sarà il contatore)
    mapping(uint256 => Doc) private _documents;
    // Mappatura per memorizzare gli hashes rifiutati
    mapping(bytes32 => bool) private _registerHash;

    // Inizializzo un evento triggerato per ogni creazione di un documento
    event DocHashAdded (uint256 indexed documentCounter, string documentUrl, bytes32 documentHash);

    constructor() {
        // Associo il ruolo di amministratore al creatore del contratto
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    // Permette all'admin di associare il ruolo di notaio ad un indirizzo
    function setHashWriterRole(address _hashWriter) external onlyRole(DEFAULT_ADMIN_ROLE){
        grantRole(HASH_WRITER, _hashWriter);
    }

    function addNewDocument(string memory _url, bytes32 _hash) external onlyRole(HASH_WRITER){
        // Controllo se l'hash è già stato registrato
        require(_registerHash[_hash], "Has already notarized");
        // Inizializzo contatore
        uint256 counter = _documentsCounter.current();
        // Mappo il documento
        _documents[counter] = Doc({documentUrl: _url, documentHash: _hash});
        // Mappo l'hash
        _registerHash[_hash] = true;
        // Incremento il contatore
        _documentsCounter.increment();
        // Emetto l'evento con i dati
        emit DocHashAdded(counter, _url, _hash);
    }

    // Recupera le info su un Documento specifico in base al suo numero
    function getDocInfo(uint256 _num) external view returns(string memory, bytes32){
        // Controllo se effettivamente esiste
        require(_num < _documentsCounter.current(), "Requested number does not exist");

        return (_documents[_num].documentUrl, _documents[_num].documentHash);
    }

    // Recupera il numero di documenti
    function getDocsCount() external view returns(uint256){
        return _documentsCounter.current();
    }

    // Recupero l'hash registrato
    function getRegisteredHash(bytes32 _hash) external view returns(bool) {
        return _registerHash[_hash];
    }
}