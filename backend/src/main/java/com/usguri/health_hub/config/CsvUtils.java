package com.usguri.health_hub.config;

import com.fasterxml.jackson.databind.ObjectReader;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import lombok.RequiredArgsConstructor;

/**
 * Classe utilitária para leitura de arquivos CSV.
 *
 * <p>Essa classe fornece métodos para ler dados de arquivos CSV e convertê-los em objetos Java. Ela
 * utiliza a biblioteca Jackson para realizar a leitura e mapeamento dos dados CSV.
 *
 * @author Said Rodrigues
 * @version 1.0
 * @since 2023-07-04
 */
@RequiredArgsConstructor
public class CsvUtils {
  private static final CsvMapper mapper = new CsvMapper();

  /**
   * Lê os dados de um arquivo CSV e converte-os em uma lista de objetos do tipo especificado.
   *
   * @param clazz O tipo dos objetos para os quais os dados CSV devem ser convertidos.
   * @param inputStream O fluxo de entrada que contém os dados CSV.
   * @param <T> O tipo dos objetos para os quais os dados CSV devem ser convertidos.
   * @return Uma lista de objetos do tipo especificado, contendo os dados do arquivo CSV.
   * @throws IOException Se ocorrer um erro durante a leitura do arquivo CSV.
   */
  public static <T> List<T> read(Class<T> clazz, InputStream inputStream) throws IOException {
    // Registra o módulo JavaTime para lidar com campos de data e hora no formato CSV
    mapper.registerModule(new JavaTimeModule());

    // Define o esquema do CSV com cabeçalho e reordenação de colunas
    CsvSchema schema = mapper.schemaFor(clazz).withHeader().withColumnReordering(true);

    // Cria um leitor de objetos a partir do esquema definido
    ObjectReader reader = mapper.readerFor(clazz).with(schema);

    // Lê e retorna todos os objetos do arquivo CSV
    return reader.<T>readValues(inputStream).readAll();
  }
}
