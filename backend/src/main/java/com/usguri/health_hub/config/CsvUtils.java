package com.usguri.health_hub.config;

import com.fasterxml.jackson.databind.ObjectReader;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CsvUtils {
  private static final CsvMapper mapper = new CsvMapper();

  public static <T> List<T> read(Class<T> clazz, InputStream inputStream) throws IOException {
    mapper.registerModule(new JavaTimeModule());
    CsvSchema schema = mapper.schemaFor(clazz).withHeader().withColumnReordering(true);
    ObjectReader reader = mapper.readerFor(clazz).with(schema);
    return reader.<T>readValues(inputStream).readAll();
  }
}
