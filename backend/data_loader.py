import pandas as pd

# Module-level constant
DEFAULT_DATA_PATH = "data/framingham.csv"


def load_data(path: str = DEFAULT_DATA_PATH) -> pd.DataFrame:
    """
    Load the dataset from a CSV file and perform basic cleaning.

    Parameters
    ----------
    path : str, optional
        File path to the CSV dataset. Defaults to DEFAULT_DATA_PATH.

    Returns
    -------
    pd.DataFrame
        Cleaned dataset with missing values removed.

    Raises
    ------
    FileNotFoundError
        If the specified file does not exist.
    pd.errors.EmptyDataError
        If the file is empty.
    """
    try:
        df = pd.read_csv(path)
    except FileNotFoundError as exc:
        raise FileNotFoundError(f"File not found at path: {path}") from exc

    # Remove rows with missing values
    df = df.dropna()

    return df