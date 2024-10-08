const fs = require('fs');
const _ = require('lodash');

// Função para ordenar e resetar os ids
const processJson = (data, sortKey = 'nome') => {
  // Função recursiva para encontrar todos os arrays no JSON
  const findAndProcessArrays = (obj) => {
    if (Array.isArray(obj)) {
      // Verifica se a chave de ordenação existe em todos os itens
      if (obj.every(item => sortKey in item)) {
        // Ordena o array com base na chave fornecida
        obj = _.sortBy(obj, sortKey);
      } else {
        console.warn(`Chave de ordenação "${sortKey}" não encontrada em todos os objetos.`);
      }

      // Reorganiza os ids do array
      obj.forEach((item, index) => {
        if (item.id !== undefined) {
          item.id = index; // Reseta os ids
        }
      });
    } else if (typeof obj === 'object' && obj !== null) {
      // Percorre todas as propriedades se for um objeto
      Object.keys(obj).forEach((key) => {
        obj[key] = findAndProcessArrays(obj[key]);
      });
    }
    return obj;
  };

  return findAndProcessArrays(data);
};

// Função para carregar e formatar o arquivo JSON
const formatJsonFile = (inputPath, sortKey) => {
  fs.readFile(inputPath, 'utf8', (err, jsonData) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      return;
    }

    try {
      let data = JSON.parse(jsonData);
      const processedData = processJson(data, sortKey);

      // Definir um novo nome para o arquivo formatado
      const outputFilePath = inputPath.replace('.json', '_formatted.json');

      // Salva o arquivo formatado com o novo nome
      fs.writeFile(outputFilePath, JSON.stringify(processedData, null, 2), (err) => {
        if (err) {
          console.error('Erro ao salvar o arquivo:', err);
        } else {
          console.log(`Arquivo JSON formatado e salvo com sucesso em ${outputFilePath}`);
        }
      });
    } catch (err) {
      console.error('Erro ao processar o arquivo JSON:', err);
    }
  });
};

// Caminho para o arquivo e chave de ordenação
const inputFilePath = './input.json';
const sortKey = process.argv[2] || 'nome'; // Use a chave passada ou 'nome' como padrão

formatJsonFile(inputFilePath, sortKey);