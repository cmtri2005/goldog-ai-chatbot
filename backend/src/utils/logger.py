import logging


class Colors:
    RESET = "\033[0m"
    COLORS = {
        logging.DEBUG: "\033[95m",
        logging.INFO: "\033[96m",
        logging.WARNING: "\033[93m",
        logging.ERROR: "\033[91m",
        logging.CRITICAL: "\033[91m",
    }


class ColoredFormatter(logging.Formatter):
    def format(self, record):
        color = Colors.COLORS.get(record.levelno, "")
        message = super().format(record)
        return f"{color}{message}{Colors.RESET}"


class LoggerConfig:
    def __init__(self, name=__name__, level=logging.INFO, enable_color=True):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(level)

        if not self.logger.handlers:
            handler = logging.StreamHandler()
            fmt = "%(asctime)s | %(name)s [%(levelname)s]: %(message)s (%(module)s.%(funcName)s:%(lineno)d)"
            handler.setFormatter(
                ColoredFormatter(fmt) if enable_color else logging.Formatter(fmt)
            )
            self.logger.addHandler(handler)

    def get(self):
        return self.logger
