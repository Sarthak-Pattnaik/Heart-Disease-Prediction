from typing import Tuple

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Module-level constants
TEST_SIZE = 0.3
RANDOM_SEED = 42
DEFAULT_TARGET = "TenYearCHD"


def preprocess(
    df: pd.DataFrame,
    target: str = DEFAULT_TARGET
) -> Tuple:
    """
    Preprocess the dataset by splitting into train-test sets and scaling features.

    Parameters
    ----------
    df : pd.DataFrame
        Input dataset containing features and target column.
    target : str, optional
        Name of the target column. Defaults to DEFAULT_TARGET.

    Returns
    -------
    tuple
        X_train, X_test, y_train, y_test after scaling.

    Raises
    ------
    KeyError
        If the target column is not present in the dataframe.
    """
    if target not in df.columns:
        raise KeyError(f"Target column '{target}' not found in dataframe.")

    # Separate features and target
    X = df.drop(columns=[target])
    y = df[target]

    # Stratified split to maintain class distribution
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=TEST_SIZE,
        random_state=RANDOM_SEED,
        stratify=y
    )

    # Standardize features
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    return X_train, X_test, y_train, y_test