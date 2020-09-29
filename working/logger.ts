import * as log from "https://deno.land/std/log/mod.ts";

// simple default logger, you can customize it
// by overriding logger and handler named "default"
log.debug("Hello world");
log.info("Hello world");
log.warning("Hello world");
log.error("Hello world");
log.critical("500 Internal server error");
